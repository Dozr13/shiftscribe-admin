import { useEffect, useState } from 'react';

import { QueryConstraint, endAt, orderByKey } from 'firebase/database';

import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../context/AuthContext';
import { useFirebase } from '../../context/FirebaseContext';
import { PermissionLevel, StringUtils, TimeParser } from '../../lib';
import { TimeRecords, UserData } from '../../types/data';

export const ViewRecordsPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirebase();

  const [csv, setCsv] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCSV, setLoadingCSV] = useState<boolean>(false);

  const fetchData = async (...query: QueryConstraint[]) => {
    setLoading(true);
    const res = await db.query(`orgs/${auth.orgId}/timeRecords`, ...query);
    setLoading(false);

    if (!res.exists()) {
      let errorMessage = 'No records match this request.';
      toast.error(errorMessage);
    }

    return res.toJSON() as TimeRecords;
  };

  const purgeOldRecords = async (timeInWeeks = 2) => {
    const weekMs = 6.048e8 * timeInWeeks;
    const threshold = Date.now() - weekMs;

    // console.log(threshold.toString());

    const json = await fetchData(orderByKey(), endAt(threshold.toString()));

    // console.log(json);

    const toDelete = new Array<number>();

    if (json) {
      setLoading(true);

      for (const key in json) {
        const numeric = Number(key);

        if (!isNaN(numeric)) {
          if (numeric < threshold) {
            toDelete.push(numeric);
          }
        }
      }
      const obj: Record<string, null> = {};

      for (const val of toDelete) {
        obj[val.toString()] = null;
      }

      if (obj) await db.update(`orgs/${auth.orgId}/timeRecords`, obj);

      setLoading(false);
    }
  };

  const GenerateCSV = async () => {
    if (!auth.orgId || !auth.user) return;

    setLoadingCSV(true);

    const json = await fetchData();
    if (!json) {
      setLoadingCSV(false);
      return;
    }

    const headers = [
      'Employee',
      'E-Mail',
      'Job',
      'Date',
      'Clocked In',
      'Clocked Out',
      'Time Worked',
      'Time On Break',
      'Combined Time',
    ];

    let resCSV = `${headers.join(',')}\n`;

    for (const item in json) {
      const obj = json[item];
      if (!obj.events) continue; // no bueno

      const userData = await db.read(`/users/${obj.submitter}`);
      const userInfo = userData.toJSON() as UserData;

      const end = Number(item);
      const { origin, timeWorked, breakTime, job } =
        TimeParser.parseCurrentRecord(obj.events);
      const timestamp = new Date(origin);
      const outTimestamp = new Date(end);
      const localeWorkTime = StringUtils.timestampHM(timeWorked);
      const localeBreakTime = StringUtils.timestampHM(breakTime);
      const localeTotalTime = StringUtils.timestampHM(timeWorked + breakTime);

      resCSV += `${userInfo.displayName},${
        userInfo.email
      },${job},${timestamp.toLocaleDateString()},${timestamp.toLocaleTimeString()},${outTimestamp.toLocaleTimeString()},${localeWorkTime},${localeBreakTime},${localeTotalTime}`;

      resCSV += '\n';
    }

    setCsv(resCSV);

    setLoadingCSV(false);
  };

  useEffect(() => {
    if (auth.user) {
      if (auth.permissionLevel < PermissionLevel.MANAGER) {
        router.back();
      }
    }
  }, [auth.permissionLevel, auth.user, router]);

  return (
    <ProtectedRoute>
      <div className='admin-panel flex flex-col justify-center items-center'>
        <div className='p-10 container flex flex-col justify-center items-center mx-auto w-96 border-2 bg-gray-400 border-gray-400 rounded-md'>
          <div className='flex py-2 container mx-auto'></div>

          <div
            className='text-3xl text-white'
            style={{ fontFamily: 'monospace' }}
          >
            ADMIN PANEL v0
          </div>

          <div
            className='text-xl text-white'
            style={{ fontFamily: 'monospace' }}
          >
            {`ORG ID: ${auth.orgId?.toUpperCase()}`}
          </div>
          {csv ? (
            <>
              <a
                href={'data:text/csv;charset=utf-8,' + encodeURI(csv)}
                onClick={() => {
                  setCsv(undefined);
                }}
              >
                <button className='w-full mt-10 p-4 bg-blue-500 rounded-md'>
                  <p className='text-md font-semibold'>Click to Download CSV</p>
                </button>
              </a>
            </>
          ) : (
            <>
              <button
                className='w-full mt-10 p-4 bg-green-500 rounded-md'
                onClick={async () => {
                  await toast.promise(
                    GenerateCSV(),
                    {
                      loading: 'Generating CSV...',
                      success: 'CSV generated successfully!',
                      error: 'Error generating CSV.',
                    },
                    {
                      duration: 3000,
                    },
                  );
                }}
                disabled={loadingCSV}
              >
                <p className='text-md font-semibold'>
                  Generate CSV of ALL work Records
                </p>
              </button>
              <button
                className='w-full mt-8 p-4 bg-red-600 rounded-md'
                onClick={() => purgeOldRecords(2)}
              >
                <p className='text-md font-semibold'>
                  Purge records older than 2 weeks
                </p>
              </button>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ViewRecordsPage;

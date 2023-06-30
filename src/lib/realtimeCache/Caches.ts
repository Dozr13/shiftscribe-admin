import { RealtimeCache } from '.';
import { OrgJobs } from '../../types/data';

export const JobCache = new RealtimeCache<OrgJobs>(60);

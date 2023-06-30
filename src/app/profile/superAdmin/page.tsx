import React from 'react';
import '../../../styles/globals.css';

const superAdmins = {
  1: {
    name: 'Mr Smith',
    age: 30,
    subjects: ['Math', 'English'],
  },
};

export default function Page() {
  const superAdmin = superAdmins[1];

  return (
    <React.Fragment>
      <h1>SuperAdmin profile</h1>
      <div>Name: {superAdmin.name}</div>
      <div>Age: {superAdmin.age}</div>
      <div>Teaches: {superAdmin.subjects.join(', ')}</div>
    </React.Fragment>
  );
}

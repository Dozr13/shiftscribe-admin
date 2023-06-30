import '../../../styles/globals.css';

const employees = {
  1: {
    name: 'John',
    age: 10,
    subjects: ['Math', 'English'],
  },
};

export default function Page() {
  const employee = employees[1];

  return (
    <>
      <h1>Employee profile</h1>
      <div>Name: {employee.name}</div>
      <div>Age: {employee.age}</div>
      <div>Studies: {employee.subjects.join(', ')}</div>
    </>
  );
}

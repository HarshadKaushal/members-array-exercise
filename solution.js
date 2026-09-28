const members = [
  { name: 'Rakesh Gupta', age: 20 },
  { name: 'Yash Jangid', age: 40 },
  { name: 'Firoz Khan', age: 41 },
  { name: 'Amrit Srivastava', age: 17 },
  { name: 'Chandraprakash Sharma' },
  { name: 'Swpril Ahuja', age: 45 },
  { name: 'Yogesh Khatri', age: 51 }
];

function print(title, value) {
  console.log(`\n${title}`);
  console.log(value);
}

// 1. First names. map builds a new array and leaves members alone.
const firstNames = members.map((member) => member.name.split(' ')[0]);
print('1. First names', firstNames);

// 2. Uppercase last names on the existing objects.
members.forEach((member) => {
  const [first, ...rest] = member.name.split(' ');
  const lastName = rest.join(' ').toUpperCase();
  member.name = [first, lastName].filter(Boolean).join(' ');
});
print('2. Uppercase last names', members);

// 3. Inclusive range: 41 and 60 both count. A missing age fails the comparison.
const between41And60 = members.filter(
  (member) => member.age >= 41 && member.age <= 60
);
print('3. Age between 41 and 60', between41And60);

// 4. Average uses only people who have a number for age.
const withAge = members.filter((member) => typeof member.age === 'number');
const averageAge =
  withAge.reduce((sum, member) => sum + member.age, 0) / withAge.length;
print('4. Average age', averageAge);

// 5. Keep the whole member, not just the winning number.
const oldest = withAge.reduce((oldestSoFar, member) =>
  member.age > oldestSoFar.age ? member : oldestSoFar
);
print('5. Oldest person', oldest);

// 6. One reduce call fills three buckets. Always return the accumulator.
const groups = members.reduce(
  (buckets, member) => {
    if (typeof member.age !== 'number') buckets.noage.push(member);
    else if (member.age < 35) buckets.young.push(member);
    else buckets.old.push(member);
    return buckets;
  },
  { young: [], old: [], noage: [] }
);
print('6. Groups', groups);

// 7. splice edits this array. A new array literal would be a different instance.
const sameArray = members;
members.splice(2, 0, { name: 'Aman Verma', age: 29 });
print('7. Inserted at index 2 (same array)', {
  sameInstance: sameArray === members,
  members
});

// 8. Square brackets on the left take array positions.
const [first, second] = members;
print('8. First and second', { first, second });

// 9. Spread copies elements into a new array. The member objects are shared.
const withNewFirst = [{ name: 'Neha Singh', age: 33 }, ...members];
print('9. New array with a member at index 0', {
  newInstance: withNewFirst !== members,
  withNewFirst
});

// 10. Curly braces on the left take object keys.
const { name, age } = members[0];
print('10. Extracted properties', { name, age });

// 11. `name: fullName` means "read name, store it as fullName".
const { name: fullName, age: years } = members[0];
print('11. Renamed properties', { fullName, years });

// 12. `...rest` must be last. It is a new object of whatever was not named.
const { name: pickedName, ...rest } = members[0];
print('12. One property and the rest', { pickedName, rest });

// 13. Later keys overwrite earlier ones. The original member is not written.
const olderCopy = { ...members[0], age: 21 };
print('13. Copied object with age overridden', {
  originalAge: members[0].age,
  olderCopy
});

// 14a. Array reduce: the accumulator is a number, so start at 0.
const totalAge = withAge.reduce((sum, member) => sum + member.age, 0);
print('14. Array reduce (total of known ages)', totalAge);

// 14b. Objects have no reduce method. Reduce their entries instead.
const description = Object.entries(members[0]).reduce((lines, [key, value]) => {
  lines.push(`${key}: ${value}`);
  return lines;
}, []);
print('14. Object reduce (fields of the first member)', description);

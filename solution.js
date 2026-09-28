const _ = require('lodash');

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

// 1. _.map walks the list. Splitting the name is still plain JavaScript.
const firstNames = _.map(members, (member) => member.name.split(' ')[0]);
print('1. First names', firstNames);

// 2. _.forEach writes back onto the objects you already have.
_.forEach(members, (member) => {
  const [first, ...rest] = member.name.split(' ');
  const lastName = rest.join(' ').toUpperCase();
  member.name = [first, lastName].filter(Boolean).join(' ');
});
print('2. Uppercase last names', members);

// 3. Inclusive range. _.inRange would exclude the end, so the test uses >= and <=.
const between41And60 = _.filter(
  members,
  (member) => member.age >= 41 && member.age <= 60
);
print('3. Age between 41 and 60', between41And60);

// 4. Drop missing ages first. _.meanBy then sums and divides.
const withAge = _.filter(members, (member) => typeof member.age === 'number');
const averageAge = _.meanBy(withAge, 'age');
print('4. Average age', averageAge);

// 5. _.maxBy returns the member object, not the number alone.
const oldest = _.maxBy(withAge, 'age');
print('5. Oldest person', oldest);

// 6. _.groupBy omits a key that nobody used, so empty groups are filled in.
const grouped = _.groupBy(members, (member) => {
  if (typeof member.age !== 'number') return 'noage';
  if (member.age < 35) return 'young';
  return 'old';
});
const groups = {
  young: grouped.young ?? [],
  old: grouped.old ?? [],
  noage: grouped.noage ?? []
};
print('6. Groups', groups);

// 7. Lodash copies into a new array. splice is what keeps this same instance.
const sameArray = members;
members.splice(2, 0, { name: 'Aman Verma', age: 29 });
print('7. Inserted at index 2 (same array)', {
  sameInstance: sameArray === members,
  members
});

// 8. Destructuring is a language feature. Lodash does not replace it.
const [first, second] = members;
print('8. First and second', { first, second });

// 9. _.concat allocates a new array and leaves members in place.
const withNewFirst = _.concat([{ name: 'Neha Singh', age: 33 }], members);
print('9. New array with a member at index 0', {
  newInstance: withNewFirst !== members,
  withNewFirst
});

// 10. Destructuring reads the fields. _.pick builds an object of the same keys.
const { name, age } = members[0];
print('10. Extracted properties', {
  destructured: { name, age },
  picked: _.pick(members[0], ['name', 'age'])
});

// 11. The rename is in the pattern. _.mapKeys renames keys on a new object.
const { name: fullName, age: years } = members[0];
const renamed = _.mapKeys(_.pick(members[0], ['name', 'age']), (value, key) => {
  if (key === 'name') return 'fullName';
  if (key === 'age') return 'years';
  return key;
});
print('11. Renamed properties', { fullName, years, renamed });

// 12. `...rest` is the leftover object. _.omit builds that leftover by key name.
const { name: pickedName, ...rest } = members[0];
print('12. One property and the rest', {
  pickedName,
  rest,
  omitted: _.omit(members[0], ['name'])
});

// 13. _.assign into a fresh {} copies, then the last source overrides age.
const olderCopy = _.assign({}, members[0], { age: 21 });
print('13. Copied object with age overridden', {
  originalAge: members[0].age,
  olderCopy
});

// 14a. _.reduce on an array. The callback is (accumulator, item).
const totalAge = _.reduce(withAge, (sum, member) => sum + member.age, 0);
print('14. Array reduce (total of known ages)', totalAge);

// 14b. _.reduce on an object. The callback is (accumulator, value, key).
const description = _.reduce(
  members[0],
  (lines, value, key) => {
    lines.push(`${key}: ${value}`);
    return lines;
  },
  []
);
print('14. Object reduce (fields of the first member)', description);

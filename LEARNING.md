# Learning guide: the members array

This file walks through every task before you run the code. Each solution branch prints the same labeled results, so you can check your understanding against the console.

The three branches start from the same list:

```js
const members = [
  { name: 'Rakesh Gupta', age: 20 },
  { name: 'Yash Jangid', age: 40 },
  { name: 'Firoz Khan', age: 41 },
  { name: 'Amrit Srivastava', age: 17 },
  { name: 'Chandraprakash Sharma' },
  { name: 'Swpril Ahuja', age: 45 },
  { name: 'Yogesh Khatri', age: 51 }
];
```

One person has no `age`. That single missing field is what makes the average, the maximum, and the groups interesting. If you treat a missing age as `0`, or if you forget to skip it, the numbers come out wrong.

| Branch | Idea |
| --- | --- |
| `native-js` | Array methods that ship with JavaScript: `map`, `filter`, `reduce`, `splice`, destructuring, spread. |
| `native-ts` | The same methods, with a `Member` type so a missing `age` is `number \| undefined` instead of a surprise. |
| `lodash-js` | Lodash helpers for the collection work. Destructuring and `splice` stay, because Lodash does not replace them. |

---

## 1. First names

**Ask:** an array of first names only.

A name here is two words separated by a space. `split(' ')` breaks `"Rakesh Gupta"` into `["Rakesh", "Gupta"]`. The first item is the first name. `map` walks the array and builds a new array of those names. It does not change `members`.

```js
const firstNames = members.map((member) => member.name.split(' ')[0]);
```

**Result:** `Rakesh`, `Yash`, `Firoz`, `Amrit`, `Chandraprakash`, `Swpril`, `Yogesh`.

**TypeScript:** the callback parameter is a `Member`. `split` returns `string[]`, and `[0]` is a `string`. No extra type is required if `Member.name` is already `string`.

**Lodash:** `_.map` does the same walk. The function you pass is still yours; Lodash does not know what a "first name" is.

```js
const firstNames = _.map(members, (member) => member.name.split(' ')[0]);
```

**Watch for:** `split(' ')` on a one-word name still works (the only part is the first name). Do this step *before* uppercasing last names, so you are reading the original strings.

---

## 2. Uppercase last names, in the given array

**Ask:** change last names to UPPERCASE inside the objects you already have.

`map` would hand you a new array of new objects. This task wants the given array, so the script writes back onto each existing object with `forEach`:

```js
members.forEach((member) => {
  const [first, ...rest] = member.name.split(' ');
  member.name = [first, rest.join(' ').toUpperCase()].filter(Boolean).join(' ');
});
```

`[first, ...rest]` keeps the first word and gathers every later word. `join(' ')` puts a multi-word surname back together before `toUpperCase()`. `.filter(Boolean)` drops an empty string when a name has no last name, so you do not end up with a trailing space.

**Result:** `Rakesh GUPTA`, `Yash JANGID`, `Firoz KHAN`, `Amrit SRIVASTAVA`, `Chandraprakash SHARMA`, `Swpril AHUJA`, `Yogesh KHATRI`.

The array is the same array. The objects are the same objects. Only the `name` strings changed.

**TypeScript:** `rest` is `string[]`. `toUpperCase()` exists because each piece is a `string`.

**Lodash:** `_.forEach` is the in-place walk. Uppercasing the string is still JavaScript.

**Watch for:** replacing the whole array with `map` looks similar in a `console.log`, but `newArray === members` would be `false`. This task cares about the objects you were given.

---

## 3. Ages from 41 to 60

**Ask:** the entries whose age is between 41 and 60.

"Between" here is inclusive: 41 counts, 60 would count, 40 does not. `filter` keeps items whose callback returns true.

```js
const between41And60 = members.filter(
  (member) => member.age >= 41 && member.age <= 60
);
```

A missing `age` is `undefined`. `undefined >= 41` is `false`, so Chandraprakash drops out without a special case.

**Result:** Firoz (41), Swpril (45), Yogesh (51). Yash (40) is outside the range.

**Lodash:** `_.filter` with the same test. `_.inRange(age, 41, 61)` is another option: Lodash's `inRange` includes the start and excludes the end, so the end must be `61` if 60 should count. The scripts use `>=` and `<=` so the bounds read the same in all three branches.

---

## 4. Average age

**Ask:** one number, the mean age.

Add the known ages, then divide by how many people had an age. Chandraprakash is left out. Counting him as `0`, or dividing by `7`, both pull the average down for the wrong reason.

```js
const withAge = members.filter((member) => typeof member.age === 'number');
const averageAge =
  withAge.reduce((sum, member) => sum + member.age, 0) / withAge.length;
```

`reduce` starts at `0` (the second argument). Each step adds the next age and returns the running total. That total divided by `withAge.length` is the average.

**Result:** `(20 + 40 + 41 + 17 + 45 + 51) / 6 = 214 / 6`, which prints as about `35.666666666666664`.

**TypeScript:** after the `typeof` check, `member.age` is still `number | undefined` to the type checker unless you narrow it. The TypeScript script filters into `Member & { age: number }` so the addition is legal.

**Lodash:** `_.meanBy` does the sum-and-divide. People without an age must be removed first, because `_.meanBy` treats a missing value as part of the math in a way you do not want here.

```js
const averageAge = _.meanBy(
  _.filter(members, (member) => typeof member.age === 'number'),
  'age'
);
```

---

## 5. Person with the maximum age

**Ask:** the whole object, not just the number 51.

`reduce` can keep an object instead of a number. Compare ages and return whichever member is older.

```js
const oldest = withAge.reduce((oldestSoFar, member) =>
  member.age > oldestSoFar.age ? member : oldestSoFar
);
```

There is no starting value this time. `reduce` begins with the first person who has an age, then walks the rest. That only works because `withAge` is not empty.

**Result:** Yogesh Khatri, age 51 (the name is `Yogesh KHATRI` if task 2 already ran).

**Lodash:** `_.maxBy(withAge, 'age')` returns that same object.

**Watch for:** `Math.max(...members.map((member) => member.age))` gives `51` or `NaN` once `undefined` is in the list. It does not give you the person.

---

## 6. Three groups

**Ask:** one object with three arrays.

```js
{
  young: [],  // age under 35
  old: [],    // 35 and above
  noage: []   // age missing
}
```

Nobody in this list is exactly 35. If someone were, they would go in `old`, because the cutoff is "under 35" versus "35 and above".

```js
const groups = members.reduce(
  (buckets, member) => {
    if (typeof member.age !== 'number') buckets.noage.push(member);
    else if (member.age < 35) buckets.young.push(member);
    else buckets.old.push(member);
    return buckets;
  },
  { young: [], old: [], noage: [] }
);
```

You must `return buckets` on every step. `reduce` uses that return value as the next `buckets`. Forgetting the return makes the next step receive `undefined`.

**Result:**

- `young`: Rakesh (20), Amrit (17)
- `old`: Yash (40), Firoz (41), Swpril (45), Yogesh (51)
- `noage`: Chandraprakash Sharma

**TypeScript:** the starting value's type is the accumulator type. Annotating it as `Record<'young' | 'old' | 'noage', Member[]>` keeps `push` honest.

**Lodash:** `_.groupBy` with a function that returns the bucket name.

```js
const grouped = _.groupBy(members, (member) => {
  if (typeof member.age !== 'number') return 'noage';
  if (member.age < 35) return 'young';
  return 'old';
});
```

`_.groupBy` omits a key that nobody landed in. The script then fills `young`, `old`, and `noage` so the shape always matches the task, even if a group is empty.

---

## 7. Insert at index 2, same array

**Ask:** add a member at index 2 without creating a new array.

`splice` edits the array you call it on. The first argument is the index, the second is how many items to delete (`0` means insert only), and the rest are the new items.

```js
const sameArray = members;
members.splice(2, 0, { name: 'Aman Verma', age: 29 });
// sameArray === members  →  true
```

**Result:** Aman sits between Yash and Firoz. Everyone who was at index 2 or later shifts right by one.

**Lodash:** there is no Lodash insert that is guaranteed to keep this exact array object. `_.concat` and spreading both allocate a new array. The Lodash branch uses `splice` here on purpose, and the comment in `solution.js` says so.

**Watch for:** `members = [members[0], members[1], newMember, ...members.slice(2)]` looks like an insert, but the `=` binds a new array. Anything else still holding the old reference will not see Aman.

---

## 8. First and second elements, by destructuring

**Ask:** pull index 0 and index 1 out with a pattern, not with `members[0]` and `members[1]`.

```js
const [first, second] = members;
```

Square brackets on the left mean "this is an array, give me positions." `first` is Rakesh. `second` is Yash. Aman is third, so he is not taken. The array itself is unchanged.

You can skip items with an empty slot: `const [, second] = members` would take only Yash.

---

## 9. New array, new member at index 0

**Ask:** a different array instance. The new person is first. Everyone already in `members` follows, in the same order.

```js
const withNewFirst = [{ name: 'Neha Singh', age: 33 }, ...members];
// withNewFirst !== members  →  true
```

The `...` copies the *elements* into a new array. It does not clone the member objects. `withNewFirst[1] === members[0]` is still true: both slots point at Rakesh's object.

**Lodash:** `_.concat([{ name: 'Neha Singh', age: 33 }], members)` also returns a new array.

**Watch for:** this is the opposite of task 7. Task 7 mutates. Task 9 allocates.

---

## 10. Pull properties out of an object

**Ask:** read fields by name, using destructuring.

Curly braces on the left match object keys.

```js
const { name, age } = members[0];
```

`name` and `age` become local variables. The member object stays as it was. Order inside the braces does not matter; names do.

---

## 11. Rename while destructuring

**Ask:** the property keeps its key on the object, but your variable gets a different name.

```js
const { name: fullName, age: years } = members[0];
```

Read `name: fullName` as "take `name`, call it `fullName` here." There is no variable called `name` after this line unless you also wrote `name` without a rename.

---

## 12. One property, and the rest

**Ask:** take one field, and pack every other field into a new object.

```js
const { name, ...rest } = members[0];
```

`name` is the string. `rest` is a new object with the remaining keys. For Rakesh, `rest` is `{ age: 20 }`. For Chandraprakash, `rest` is `{}` because `age` was never there.

The `...` in an object pattern must be last.

**Lodash:** `_.pick(member, ['name', 'age'])` builds an object of chosen keys. `_.omit(member, ['name'])` is the rest-without-`name` object. The branch still shows the `...rest` pattern, because the task asks for the spread operator.

---

## 13. Copy an object and override one field

**Ask:** a new object, same fields, one of them replaced, in a single expression.

```js
const olderCopy = { ...members[0], age: 21 };
```

Spread copies the current fields, then `age: 21` overwrites `age`. Later keys win. Putting `age: 21` *before* the spread would lose, because the spread would copy the original age afterwards.

`olderCopy` is a new object. `members[0].age` is still 20.

**Lodash:** `_.assign({}, members[0], { age: 21 })` copies into a fresh `{}` and then applies the override. `_.assign(members[0], { age: 21 })` would mutate Rakesh. The empty `{}` is what keeps the original safe.

---

## 14. `reduce` on an array and on an object

**Ask:** use `reduce` twice. Once the collection is an array. Once it is an object.

You already used array `reduce` for the average and the groups. This task makes the two shapes explicit.

**Array.** Sum the known ages. The accumulator is a number.

```js
const totalAge = withAge.reduce((sum, member) => sum + member.age, 0);
```

**Result:** `214`.

**Object.** Plain objects have no `.reduce` method. Native JavaScript reduces an object by reducing its entries. Lodash can reduce the object directly.

```js
const person = members[0];
const labeled = Object.entries(person).reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});
```

`Object.entries` turns `{ name: 'Rakesh GUPTA', age: 20 }` into `[['name', 'Rakesh GUPTA'], ['age', 20]]`. Reducing those pairs rebuilds an object. The scripts use that to produce a display line for each field, so the console shows the object being folded entry by entry.

```js
const description = Object.entries(person).reduce((lines, [key, value]) => {
  lines.push(`${key}: ${value}`);
  return lines;
}, []);
// ['name: Rakesh GUPTA', 'age: 20']
```

**Lodash** passes the object itself:

```js
const description = _.reduce(
  person,
  (lines, value, key) => {
    lines.push(`${key}: ${value}`);
    return lines;
  },
  []
);
```

Notice the callback order. Array `reduce` is `(accumulator, item)`. Lodash's object `reduce` is `(accumulator, value, key)`.

**Watch for:** the starting value decides the shape of the result. Start with `0` and you are building a number. Start with `[]` or `{}` and you are building a collection. Leave it off, and `reduce` starts from the first element, which is a different type than you usually want when the result is a sum or a new object.

---

## Order inside the scripts

The tasks share one `members` array, and two of them change it. The scripts run in this order so each result is still explainable:

1. First names, from the original strings.
2. Uppercase last names on those same objects.
3. Age filter, average, oldest, and groups. Names are already uppercased; ages are not.
4. `splice` Aman in at index 2, then destructure the first two people (Rakesh and Yash).
5. Build a new array with Neha at the front.
6. Object destructuring, rename, rest, and the age override. These use `members[0]` and do not write back to him, except where a task is only reading.
7. Array `reduce` for the age total, and object `reduce` for Rakesh's fields.

If you uppercase last names before printing groups, the group lists show `GUPTA` rather than `Gupta`. That is expected. The ages do not move.

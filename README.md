# Members array exercise

Three ways to solve the same list of tasks, plus a walkthrough you can read beside the code.

Read [LEARNING.md](LEARNING.md) first. It explains each task, the result you should see, and how the three branches differ.

## Branches

| Branch | What it uses | How to run |
| --- | --- | --- |
| `main` | The lesson only | Read `LEARNING.md` |
| `native-js` | Built-in JavaScript | `node solution.js` |
| `native-ts` | Built-in TypeScript | `npx tsx solution.ts` |
| `lodash-js` | Lodash | `npm install` then `node solution.js` |

Check out a branch to run that solution:

```bash
git checkout native-js
node solution.js
```

The sample people added by the scripts (the exercise does not name them):

- Same array, index 2: `{ name: 'Aman Verma', age: 29 }`
- New array, index 0: `{ name: 'Neha Singh', age: 33 }`
- Copied object with one override: first member, `age: 21`

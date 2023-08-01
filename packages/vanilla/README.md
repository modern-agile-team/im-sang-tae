# @im-sang-tae/vanilla - A Global State Management Library

[![npm version](https://badge.fury.io/js/@im-sang-tae%2Fvanilla.svg)](https://badge.fury.io/js/@im-sang-tae%2Fvanilla)
![license_badge](https://img.shields.io/badge/license-MIT-lightgrey) 

@im-sang-tae/vanilla is a global state management library for JavaScript applications. It's designed to provide a simple and intuitive API for managing state in an efficient and scalable way.

## Features

- Supports both atom and selector for managing state.
- Easy to integrate with any JavaScript application.
- Efficient updates and minimal re-renders.
- Support for tracking dependencies between selectors.

## Installation

```bash
# using npm
npm install @im-sang-tae/vanilla

# using yarn
yarn add @im-sang-tae/vanilla
```

## Usage

To start using IM_SANG_TAE in your project, you need to create atoms or selectors with an initial state:

```javascript
import { createAtom } from "@im-sang-tae/vanilla";

// create atom
const myAtom = createAtom({
  key: "myAtom",
  initialState: 0,
});

// create selector
const mySelector = createAtom({
    key: "mySelector",
    get: ({get}) => {
        return get(myAtom) + 1;
    }
})
```

You can get the current state and set a new state using the atomState method from the state manager:

```javascript
import { atomState, subscribe } from "@im-sang-tae/vanilla";

const [getMyAtom, setMyAtom] = atomState(myAtom);
const [getMySelector, setMySelector] = atomState(mySelector);

subscribe(myAtom, () => {
  console.log(getMyAtom());
});

subscribe(mySelector, () => {
  console.log(getMySelector());
});
```

## License

This project is licensed under the MIT License.

## Contribute

[Contribute](https://github.com/modern-agile-team/im-sang-tae/blob/master/.github/workflows/CONTRIBUTE.md).

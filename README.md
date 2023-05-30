# IM_SANG_TAE - A Global State Management Library

IM_SANG_TAE is a global state management library for JavaScript applications. It's designed to provide a simple and intuitive API for managing state in an efficient and scalable way.

## Features

- Supports both atom and selector for managing state.
- Easy to integrate with any JavaScript application.
- Efficient updates and minimal re-renders.
- Support for tracking dependencies between selectors.

## Installation
```bash
# using npm
npm install im-sang-tae

# using yarn
yarn add im-sang-tae
```

## Usage

To start using IM_SANG_TAE in your project, you need to create atoms or selectors with an initial state:

```javascript
import { defaultStore } from "im_sang_tae";

// create atom
const myAtom = defaultStore.createAtom({
  key: "myAtom",
  initialState: 0,
});

// create selector
const mySelector = defaultStore.createAtom({
    key: "mySelector",
    get: ({get}) => {
        return get(myAtom) + 1;
    }
})
```

You can get the current state and set a new state using the atomState method from the state manager:

```javascript
import { defaultManager } from "im_sang_tae";

const [getMyAtom, setMyAtom] = defaultManager.atomState(myAtom);
const [getMySelector, setMySelector] = defaultManager.atomState(mySelector);

defaultManager.subscribe(myAtom, () => {
  console.log(getMyAtom());
});

defaultManager.subscribe(mySelector, () => {
  console.log(getMySelector());
});
```

## License
This project is licensed under the MIT License.
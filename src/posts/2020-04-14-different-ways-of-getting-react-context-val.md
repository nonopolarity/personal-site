---
title: Different Ways of Getting React Context Value
date: "2020-04-14"
tags: ['react', 'context']
author: "Chih-Ching Chang"
path: "/different-ways-of-getting-react-context-val"
---

Recently I am refactoring our code base for extracting out similar logic to [React Context](https://reactjs.org/docs/context.html).
Since our code base has maintained by several developers over the years, there are a lot of different kinds of coding style.
I would like to write a post to note down how to use React Context value in different situations.

Supposed we have a context look like the following:

```javascript
import React from 'react';

export const MyContext = React.createContext({
  someValue: undefined,
});

export const MyContextProvider = ({
  children,
}) => {

  const value = { someValue: 'someValue' };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = React.useContext(MyContext);

  if (!context) {
    throw new Error(
      'useMyContext must be used within a MyContextProvider'
    );
  }
  return context;
};
```

First, in class component, we could write it like what official document suggests:

```javascript
import { MyContext } from './myContext';

class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let { someValue } = this.context;
    /* render something based on someValue */
  }
}
```

Or if you are writing functional component, you could use React Hooks.

```javascript
import { useMyContext } from './myContext';

const MyComponent = () => {
  const { someValue } = useMyContext();
  return (/* render something based on someValue */);
};
```

In our code base, there are components using `recompose`.
At first, I think it's functional component because of its writing style.
Yet, we cannot use hooks directly inside it.

And... I found another way to use context inside this kind of component, called [`fromRenderProps`](https://github.com/acdlite/recompose/blob/master/docs/API.md#fromrenderprops).

```javascript
import React from 'react';
import { fromRenderProps } from 'recompose';
import { MyContext } from './myContext';

const enhance = 
  fromRenderProps(MyContext.Consumer, ({ someValue }) => ({ someValue }));

const MyComponent = enhance(({ someValue }) => {
  return (/* render something based on someValue */);
};

```

If I encounter more ways to get context value, I will update this post :D
## To Install, Test and Run

0. npm -g install yarn (NOT RECOMMENDED: yarn would like to use your systems package manager to install)
1. yarn install
2. yarn test
3. yarn start

## To add auto-type detection for jest

https://stackoverflow.com/questions/42024526/vscode-automatic-type-acquisition-for-jest

1. add jsconfig.json to root with the following content

```
{
  "typeAcquisition": {
    "include": [
      "jest"
    ]
  }
}
```

## Upload to S3

aws s3 cp ./build/ s3://nchan-csr/green/ --recursive --include "*"

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Simulate Form Input

https://github.com/facebook/react/issues/11488

```
var input = document.forms[0].status
var lastValue = input.value;
input.value = 'ACTIVE';
var event = new Event(input.type === 'select-one' ? 'change' : 'input', { bubbles: true });
// hack React15
event.simulated = true;
// hack React16 descriptor value
var tracker = input._valueTracker;
if (tracker) {
  tracker.setValue(lastValue);
}
input.dispatchEvent(event);

var input = document.forms[0].first_name
input.value = 'Pia';
if (input._valueTracker) { input._valueTracker.setValue(''); }
input.dispatchEvent(new Event(input.type === 'select-one' ? 'change' : 'input', { bubbles: true }));

var input = document.forms[0].status
input.value = 'ACTIVE';
if (input._valueTracker) { input._valueTracker.setValue(''); }
input.dispatchEvent(new Event(input.type === 'select-one' ? 'change' : 'input', { bubbles: true }));
```

or

```
function simulateFormInput(inputName, inputValue) {
  const input = document.forms[1][inputName];

  // if radio type
  if (typeof(input.type) === 'undefined') {
    const inputIndex = Array.from(input).reduce((a, e, i) => e.value === inputValue ? i : a, -1);
    if (~inputIndex) { // input index !== -1
      // save off last value
      const lastValue = input[inputIndex].value;
      // set value for radio group
      input.value = inputValue;
      // create synthetic event
      var event = new Event('click', { bubbles: true });
      // hack React15
      event.simulated = true;
      // hack React16 descriptor value
      if (input[inputIndex]._valueTracker) {
        // update value through react underlying setValue prop
        input[inputIndex]._valueTracker.setValue(lastValue);
      }
      // simulate click event on radio
      input[inputIndex].dispatchEvent(event);
    }
  } else {
    // save off last value
    const lastValue = input.value;
    // update to new value
    input.value = inputValue;

    // turn checked to true if checkbox
    if (input.type === 'checkbox') {
      input.checked = true;
    }

    // create synthetic event
    var event = new Event(
      input.type === 'select-one'
      ? 'change'
      : input.type === 'checkbox' ? 'click' : 'input',
      { bubbles: true }
    );
    // hack React15
    event.simulated = true;
    // hack React16 descriptor value
    if (input._valueTracker) {
      // update value through react underlying setValue prop
      input._valueTracker.setValue(lastValue);
    }
    // simulate input event for drop-down or text-field
    input.dispatchEvent(event);
  }
}

simulateFormInput('customer_type', 'broadband');
simulateFormInput('base', 'Camp Pendleton');
simulateFormInput('area', 'Area 13');
simulateFormInput('building', '1396');
simulateFormInput('room', 'A123');
simulateFormInput('internet___basic_std_exp', 'internet___expanded');
simulateFormInput('basic_tv', 'basic_tv___yes');
simulateFormInput('username', 'nc111919');
simulateFormInput('email', 'nc111919@test.boingo.com');
simulateFormInput('password', 'password');
simulateFormInput('first_name', 'n');
simulateFormInput('last_name', 'c');
simulateFormInput('payment_cc.credit_card_number', '4111111111111111');
simulateFormInput('exp_month', '1');
simulateFormInput('exp_year', '2020');
simulateFormInput('cvv2', '123');
simulateFormInput('postal_code', '90024');
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

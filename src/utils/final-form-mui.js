import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import useDebounce from '../useDebounce';

/**
 * Final-Form Material-UI Text Field Wrapper
 * Third-party Final-Form-Material-UI library does not handle other 'on' functions except onClick
 * Implements debounce via useDebounce custom hook
 * 
 * NOTE: initialValue can only be set once from caller, subsequent calls to initialValue will have not effect
 * 
 * @param {object} FormControlProps [optional] - Properties added on wrapper around TextField
 * @param {object} TextFieldProps [optional] - Properties added direct to TextField
 * @param {object} inputProps [optional] - Properties added direct to native input field
 * @param {function} onClick [optional] - Handler attached to the input field
 * @param {function} onFocus [optional] - Handler attached to the input field
 * @param {function} onBlur [optional] - Handler attached to the input field
 * @param {function} onChange [optional] - Handler attached to the input field
 * @param {function} onKeyDown [optional] - Handler attached to the input field
 * @param {boolean} uncontrolled [optional] - onChange event will be debounced for better performance
 * @param {string} uncontrolledValue [optional] - Value unsed to sync input value with form value (used for form.reset)
 * 
 * @returns {object} Rendered final-form input field component styled with material-ui
 * 
 * @see {@link https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/}
 * 
 * @example
 *  <FfmTextField
 *    name="mytextfield"
 *    initialValue="myvalue"
 *    onClick={(event, input, meta)=>console.log('click')}
 *    onFocus={(event, input, meta)=>console.log('focus')}
 *    onBlur={(event, input, meta)=>console.log('blur')}
 *    onChange={(event, input, meta)=>console.log('change')}
 *    validate={composeValidators(
 *      required(),
 *    )}
 *    TextFieldProps={{
 *      variant:'outlined',
 *      label:'my text label'
 *    }}
 *    inputProps={{
 *      maxLength:16
 *    }}
 *  />
 */
export const FfmTextField = (props) => {
  const {FormControlProps, TextFieldProps, inputProps, onClick, onFocus, onBlur, onChange, onKeyDown, uncontrolled, uncontrolledValue, classes } = props;
  // bypass typeError on spread operator in object destructuring
  const rest = {
    ...props,
    FormControlProps: undefined,
    TextFieldProps: undefined,
    inputProps: undefined,
    onClick: undefined,
    onFocus: undefined,
    onBlur: undefined,
    onChange: undefined,
    onKeyDown: undefined,
    classes: undefined,
    uncontrolled: undefined,
    uncontrolledValue: undefined,
  };

  const debouncer = useDebounce();
  const ref = useRef();

  // sync with input value for form.reset()
  useEffect(()=>{
    if (ref.current.value !== uncontrolledValue) {
      ref.current.value = uncontrolledValue || '';
    }
  }, [uncontrolledValue]);

  return (
    <Field {...rest}>
      {({ input, meta }) => (//meta.error && meta.touched && <span>{meta.error}</span>
      <FormControl {...FormControlProps} classes={classes}>
        <TextField
          {...input}
          {...TextFieldProps}
          value={uncontrolled ? undefined : input.value} // break two-way binding for input.value
          defaultValue={uncontrolled ? input.value : input.defaultValue} // default value can only be set once from caller
          onClick={onClick ? event=>onClick(event, input, meta) : undefined}
          onFocus={onFocus ? event=>{onFocus(event, input, meta); input.onFocus(event);} : input.onFocus}
          onBlur={onBlur ? event=>{onBlur(event, input, meta); input.onBlur(event);} : input.onBlur}
          onKeyDown={
            onKeyDown
            ? ( uncontrolled ? debouncer(event=>onKeyDown(event, input, meta)) : event=>onKeyDown(event, input, meta) )
            : undefined
          }
          onChange={
            onChange
            ? ( uncontrolled ? debouncer(event=>{onChange(event, input, meta); input.onChange(event);}) : event=>{onChange(event, input, meta); input.onChange(event);})
            : ( uncontrolled ? debouncer(input.onChange) : input.onChange )
          }
          InputProps={{
            inputProps:{
              ...inputProps,
              ref: ref,
            }
          }}
          // fix label overlap with text since input value and label value out of sync
          InputLabelProps={
            uncontrolled && // control shink if uncontrolled
            {shrink: (!!uncontrolledValue || meta.active)} // shrink if uncontrolled is empty or field is focused
          }
          error={meta.error && meta.touched}
        />
        {meta.error && meta.touched && <FormHelperText error>{meta.error}</FormHelperText>}
      </FormControl>
      )}
    </Field>
  );
}
// type declaration and enforcement
FfmTextField.propTypes = {
  FormControlProps: PropTypes.object,
  TextFieldProps: PropTypes.object,
  inputProps: PropTypes.object,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  uncontrolled: PropTypes.bool,
  uncontrolledValue: PropTypes.string,
};

/**
 * Final-Form Material-UI Text Field Wrapper for Select
 * Third-party Final-Form-Material-UI library does not handle other 'on' functions except onClick
 * 
 * @param {array} children [optional] - React component added to the body of the select
 * @param {object} FormControlProps [optional] - Properties added on wrapper around TextField
 * @param {object} TextFieldProps [optional] - Properties added direct to TextField
 * @param {object} SelectProps [optional] - Properties added direct to Select
 * @param {object} MenuProps [optional] - Properties added direct to menu field
 * @param {object} inputProps [optional] - Properties added direct to native select field
 * @param {boolean} native [optional] - Uses native select HTML tags instead of input fields
 * @param {function} onClick [optional] - Handler attached to the input field
 * @param {function} onFocus [optional] - Handler attached to the input field
 * @param {function} onBlur [optional] - Handler attached to the input field
 * @param {function} onChange [optional] - Handler attached to the input field
 * 
 * @returns {object} Rendered final-form select field component styled with material-ui
 * 
 * @example
 *  <FfmSelect
 *    name="myselectfield"
 *    initialValue={10}
 *    onClick={(event, input, meta)=>console.log('click')}
 *    onFocus={(event, input, meta)=>console.log('focus')}
 *    onBlur={(event, input, meta)=>console.log('blur')}
 *    onChange={(event, input, meta)=>console.log('change')}
 *    native={true}
 *    validate={composeValidators(
 *      required(),
 *    )}
 *    FormControlProps={{
 *      fullWidth:true,
 *    }}
 *    TextFieldProps={{
 *      variant:'outlined',
 *      label:'my label',
 *    }}
 *  >
 *    <MenuItem value=""><em>None</em></MenuItem>
 *    <MenuItem value={10}>Ten</MenuItem>
 *    <MenuItem value={20}>Twenty</MenuItem>
 *    <MenuItem value={30}>Thirty</MenuItem>
 *  </FfmSelect>
 */
export const FfmSelect = (props) => {
  const {FormControlProps, TextFieldProps, SelectProps, MenuProps, inputProps, native, onClick, onFocus, onBlur, onChange, children, classes } = props;

  // bypass typeError on spread operator in object destructuring
  const rest = {
    ...props,
    FormControlProps: undefined,
    TextFieldProps: undefined,
    SelectProps: undefined,
    inputProps: undefined,
    native: undefined,
    MenuProps: undefined,
    onClick: undefined,
    onFocus: undefined,
    onBlur: undefined,
    onChange: undefined,
    children: undefined,
    classes: undefined,
  };

  return (
    <Field {...rest}>
      {({ input, meta }) => (//meta.error && meta.touched && <span>{meta.error}</span>
      <FormControl {...FormControlProps} classes={classes}>
        <TextField
          {...input}
          {...TextFieldProps}
          select
          onClick={onClick ? event=>onClick(event, input, meta) : undefined}
          onFocus={onFocus ? event=>{onFocus(event, input, meta); input.onFocus(event);} : input.onFocus}
          onBlur={onBlur ? event=>{onBlur(event, input, meta); input.onBlur(event);} : input.onBlur}
          SelectProps={{
            ...SelectProps,
            native: !!native, // cast to boolean
            onChange: onChange ? event=>{onChange(event, input, meta); input.onChange(event);} : input.onChange,
            MenuProps: {...MenuProps},
          }}
          inputProps={{
            ...inputProps,
          }}
          error={meta.error && meta.touched}
        >
          {children}
        </TextField>
        {meta.error && meta.touched && <FormHelperText error>{meta.error}</FormHelperText>}
      </FormControl>
      )}
    </Field>
  );
}
// type declaration and enforcement
FfmSelect.propTypes = {
  children: PropTypes.array,
  FormControlProps: PropTypes.object,
  TextFieldProps: PropTypes.object,
  SelectProps: PropTypes.object,
  MenuProps: PropTypes.object,
  inputProps: PropTypes.object,
  native: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

/* for demonstration purpose if we need to use select instead of text field
export const FfmSelectSelect = ({children, FormControlProps, SelectProps, native, value, onChange, onClick, onFocus, onBlur, ...FieldProps}) => (
  <Field {...FieldProps}>
    {({ input, meta }) => (//meta.error && meta.touched && <span>{meta.error}</span>
    <FormControl {...FormControlProps}>
      <Select
        {...input}
        {...SelectProps}
        native={!!native} // cast boolean
        value={value}
        onClick={(event)=>{onClick && onClick(event, input, meta);}}
        onChange={(event)=>{onChange && onChange(event, input, meta); input.onChange(event);}}
        onFocus={(event)=>{onFocus && onFocus(event, input, meta); input.onFocus(event);}}
        onBlur={(event)=>{onBlur && onBlur(event, input, meta); input.onBlur(event);}}
        error={meta.error && meta.touched}
      >
        {children}
      </Select>
      {meta.error && meta.touched && // meta.error will fail to render if field does not have name
      <FormHelperText error>{meta.error}</FormHelperText>
      }
    </FormControl>
    )}
  </Field>
);
*/
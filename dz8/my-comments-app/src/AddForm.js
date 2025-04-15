import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddForm = ({ onSubmit, fields }) => {
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});

  const validationSchema = Yup.object().shape(
    fields.reduce((acc, field) => {
      let validator = Yup.string();
      if (field.required) validator = validator.required('Required');
      if (field.type === 'email') validator = validator.email('Invalid email');
      acc[field.name] = validator;
      return acc;
    }, {})
  );

  return (
    <div className="add-form">
      <h2>Add New Item</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-group">
            {fields.map(field => (
              <div key={field.name} className="form-field">
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <Field 
                    as="textarea" 
                    id={field.name} 
                    name={field.name} 
                    placeholder={field.label}
                    className="form-control"
                  />
                ) : (
                  <Field 
                    type={field.type || 'text'} 
                    id={field.name} 
                    name={field.name} 
                    placeholder={field.label}
                    className="form-control"
                  />
                )}
                <ErrorMessage name={field.name} component="div" className="error-text" />
              </div>
            ))}
            <button type="submit" disabled={isSubmitting}>
              Add Item
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddForm;
import { setTextContent } from '.';
import { setFieldValue, setBackgroundImage } from './common';
import * as yup from 'yup';
import { ValidationError } from 'yup';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); // hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  if (!form) return;

  const formValues = {};

  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // S2
  const formData = new FormData(form);
  for (const [key, value] of formData) {
    formValues[key] = value;
  }

  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => x.length >= 3).length >= 2
      ),
    description: yup.string().required(),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    // reset custom error
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.name);
    console.log(error.inner);

    const errorLogs = {};

    for (const validationError of error.inner) {
      const name = validationError.path;
      if (errorLogs[name]) continue; // ignore

      setFieldError(form, name, validationError.message);

      // mark error log
      errorLogs[name] = true;
    }
  }

  // add class .was-validated to form
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    // validate
    const isValid = await validatePostForm(form, formValues);
    if (!isValid) return;

    onSubmit?.(formValues);
  });
}

import { setTextContent } from '.';
import { setFieldValue, setBackgroundImage, randomNumber } from './common';
import * as yup from 'yup';
import { ValidationError } from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

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
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please provide random image')
        .url('Please use url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (value) =>
          Boolean(value?.name)
        )
        .test('max-3-mb', 'The image is to large (Max 3MB)', (file) => {
          const fileSize = file?.size || 0;
          const MAX_SIZE = 3 * 1024 * 1024;
          return fileSize <= MAX_SIZE;
        }),
    }),
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
    ['title', 'author', 'imageUrl', 'image'].forEach((name) =>
      setFieldError(form, name, '')
    );
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

async function validateFormField(form, formValues, name) {
  try {
    // clear prev error
    setFieldError(form, name, '');
    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    console.log(error);
    setFieldError(form, name, error.message);
  }

  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');

  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImage(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');

  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      console.log(e.target.value);
      renderImageSourceControl(form, e.target.value);
    });
  });
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;
    setFieldValue(form, '[name="imageUrl"]', imageUrl); // hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');
  if (!uploadImage) return;

  uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(document, '#postHeroImage', imageUrl);

      validateFormField(
        form,
        { imageSource: ImageSource.UPLOAD, image: file },
        'image'
      );
    }
  });
}

function initValidationOnChange(form) {
  ['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener('input', (e) => {
        const newValue = e.target.value;
        validateFormField(form, { [name]: newValue }, name);
      });
    }
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);

  initRandomImage(form);

  initRadioImage(form);

  initUploadImage(form);

  initValidationOnChange(form);

  let submitting = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitting) return;

    showLoading(form);
    submitting = true;

    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    // validate
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}

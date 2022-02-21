import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedField(formValues) {
  const payload = { ...formValues };

  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }

  delete payload.imageSource;

  // remove id if add mode
  if (!payload.id) delete payload.id;

  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handleFormSubmit(formValues) {
  try {
    const payload = removeUnusedField(formValues);
    const formData = jsonToFormData(payload);

    // check add or edit mode
    let savedPost = null;
    if (formValues.id) {
      savedPost = await postApi.updateFormData(formData);
    } else {
      savedPost = await postApi.addFormData(formData);
    }

    // show toast message
    toast.success('Save post successfully');

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('Fail to save post', error);
    toast.error(`Error: ${error.message}`);
  }
}

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handleFormSubmit,
    });
  } catch (error) {
    console.error('Add edit post fail', error);
  }
})();

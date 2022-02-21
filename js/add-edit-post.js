import postApi from './api/postApi';
import { initPostForm } from './utils';

async function handleFormSubmit(formValues) {
  try {
    // check add or edit mode
    let savedPost = null;
    if (formValues.id) {
      savedPost = await postApi.update(formValues);
    } else {
      savedPost = await postApi.add(formValues);
    }

    // redirect to detail page
    window.location.assign(`/post-detail.html?id=${savedPost.id}`);
  } catch (error) {
    console.log('Fail to save post', error);
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

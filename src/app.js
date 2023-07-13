import * as yup from 'yup';
/* import onChange from 'on-change'; // зачем */

const state = {
  form: {
    valid: true,
    inputList: [],
    errors: {
      rssExist: 'RSS уже существует',
      rssIsNotValid: 'Ссылка должна быть валидным URL',
    },
  },
};

const elements = {
  form: document.querySelector('form'),
  textError: document.querySelector('.text-danger'),
  input: document.querySelector('input'),
};

const isValid = (inputData) => {
  const shema = yup.string().required().url();
  shema.validate(inputData, { abortEarly: false })
    .catch(() => {
      elements.textError.textContent = state.form.errors.rssIsNotValid;
    });
};

/* const watchedState = onChange(state, () => {

}); */

export default () => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    elements.textError.textContent = '';
    const formData = new FormData(e.target);
    const val = formData.get('url').trim();
    state.form.value = val;
    isValid(val);
    if (state.form.inputList.includes(val)) {
      elements.textError.textContent = state.form.errors.rssExist;
    }
    state.form.inputList.push(val);
    // e.target.reset();
    // поле очищается, но на любой запрос срабатывает 'Ссылка должна быть валидным URL'
  });
};
// 1 - поле не очищается


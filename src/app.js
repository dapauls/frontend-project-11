import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
// import { setLocale } from 'yup';
import resources from './locales/index.js';

const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: true,
  resources,
}).then();

const initialState = {
  form: {
    value: '',
    sameValue: '',
    valid: true,
    inputList: [],
    // error: null,
  },
};

const elements = {
  form: document.querySelector('form'),
  textError: document.querySelector('.text-danger'),
  input: document.querySelector('input'),
};

const watchedState = onChange(initialState, (_path, value) => {
  elements.textError.textContent = '';
  const shema = yup.string().required().url().notOneOf(initialState.form.inputList);
  shema.validate(value, { abortEarly: false })
    .then(() => {
      initialState.form.inputList.push(value);
      elements.input.value = '';
    })
    .catch((error) => {
      elements.textError.textContent = i18nInstance.t(error);
    });
});

export default () => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const val = formData.get('url').trim();
    if (watchedState.form.value === val) {
      watchedState.form.sameValue = val;
    } else {
      watchedState.form.value = val;
    }
  });
};

// Во втором шаге не доделано:
// 1 - рамка не подсвечивается красным
// 2 - текст подсказки снизу сливается с фоном. через атрибут стайл и сиэсэс не исправляется
// (а ошибки красные автоматически - как так??)
// Третий шаг:
// ДОП - линтер помечает расширения файлов в импорте, как ошибку,
// но без расширения ничего не работает
// ДОП - по факту вроде сделала как правильно, а всё сломалось

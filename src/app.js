import * as yup from 'yup';
import onChange from 'on-change';

const initialState = {
  form: {
    value: '',
    sameValue: '',
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

const isValid = (val) => {
  const shema = yup.string().required().url();
  shema.validate(val, { abortEarly: false })
    .catch(() => {
      elements.textError.textContent = initialState.form.errors.rssIsNotValid;
    });
};

const watchedState = onChange(initialState, (_path, value, _previousValue) => {
  elements.textError.textContent = '';
  isValid(value);
  if (initialState.form.inputList.includes(value)) {
    elements.textError.textContent = initialState.form.errors.rssExist;
  }
  initialState.form.inputList.push(value);
  elements.input.value = '';
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

// 1 - рамка не подсвечивается красным
// 2 - текст подсказки снизу сливается с фоном. через атрибут стайл и сиэсэс не исправляется
// (а ошибки красные автоматически - как так??)
// 3 - правильно ли я сделала, что изВалид перенесла отдельно? не сказывается ли это на работе?
// после выдачи ошибки код как бы перестает работать?

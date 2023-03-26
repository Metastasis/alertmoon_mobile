// @ts-ignore
import {FormField} from '@ory/kratos-client';

const translations = {
  password: {
    title: 'Пароль',
    position: 2,
  },
  method: {
    title: 'Отправить',
    position: 2,
  },
  'traits.email': {
    title: 'E-Mail',
    position: 1,
  },
  'traits.name.first': {
    title: 'Имя',
    position: 2,
  },
  'traits.name.last': {
    title: 'Фамилия',
    position: 3,
  },
  'traits.name.birthday': {
    title: 'День рождения',
    position: 4,
  },
  'traits.website': {
    title: 'Сайт',
    position: 4,
  },
  identifier: {
    title: 'E-Mail',
    position: 0,
  },
  to_verify: {
    title: 'E-mail',
    position: 0,
  },
};

type Translations = typeof translations;

export const getTitle = (key: string): string | null =>
  key in translations ? translations[key as keyof Translations].title : null;

export const getPosition = (field: FormField) =>
  field.name && field.name in translations
    ? translations[field.name as keyof Translations].position
    : Infinity;

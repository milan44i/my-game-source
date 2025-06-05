import * as yup from 'yup'

export const formSchema = {
  game: yup.string().required('Game is required'),
  title: yup.string().required('Title is required'),
  excerpt: yup.string().max(200, 'Excerpt must be at most 200 characters').required('Excerpt is required'),
  editor: yup.string().required('Editor is required'),
  rating: yup.string().notOneOf(['Select a rating'], 'Please select a valid rating'),
  img: yup.string().url('Image must be a valid URL').required('Image is required'),
}

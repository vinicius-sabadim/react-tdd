import React from 'react'
import { render } from '@testing-library/react'
import PostEditor from './PostEditor'

describe('PostEditor', () => {
  test('renders a form with title, content, tags, and a submit button', () => {
    const { getByLabelText, getByText } = render(<PostEditor />)
    const title = getByLabelText(/title/i)
    const content = getByLabelText(/content/i)
    const tags = getByLabelText(/tags/i)
    const submitButton = getByText(/save/i)

    expect(title).toBeInTheDocument()
    expect(content).toBeInTheDocument()
    expect(tags).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})

import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'
import { Redirect as mockRedirect } from 'react-router'
import faker from 'faker'

import PostEditor from './PostEditor'
import { savePost as mockSavePost } from '../api'

jest.mock('../api', () => {
  return {
    savePost: jest.fn()
  }
})

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null)
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

type User = {
  id: string
}

function getPost(user: User) {
  return {
    authorId: user.id,
    title: faker.lorem.words(),
    content: faker.lorem.sentences(),
    tags: [faker.random.word(), faker.random.word()]
  }
}

describe('PostEditor', () => {
  test('renders a form with title, content, tags, and a submit button', () => {
    const user = {
      id: faker.random.uuid()
    }

    const { getByLabelText, getByText } = render(<PostEditor author={user} />)
    const titleLabel = getByLabelText(/title/i)
    const contentLabel = getByLabelText(/content/i)
    const tagsLabel = getByLabelText(/tags/i)
    const submitButton = getByText(/save/i)

    expect(titleLabel).toBeInTheDocument()
    expect(contentLabel).toBeInTheDocument()
    expect(tagsLabel).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  test('the submit button is disabled when clicked', () => {
    const user = {
      id: faker.random.uuid()
    }

    const { getByText } = render(<PostEditor author={user} />)
    const submitButton = getByText(/save/i)
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
  })

  test('when submit call the api with the post', () => {
    const user = {
      id: faker.random.uuid()
    }
    const post = getPost(user)

    const { getByLabelText, getByText } = render(<PostEditor author={user} />)

    const titleLabel = getByLabelText(/title/i)
    fireEvent.change(titleLabel, { target: { value: post.title } })

    const contentLabel = getByLabelText(/content/i)
    fireEvent.change(contentLabel, { target: { value: post.content } })

    const tagsLabel = getByLabelText(/tags/i)
    fireEvent.change(tagsLabel, { target: { value: post.tags.join(', ') } })

    const submitButton = getByText(/save/i)

    fireEvent.click(submitButton)
    expect(mockSavePost).toBeCalledTimes(1)
    expect(mockSavePost).toBeCalledWith(post)
  })

  test('after saving, redirects to home', async () => {
    const user = {
      id: faker.random.uuid()
    }
    const post = getPost(user)

    const { getByLabelText, getByText, debug } = render(
      <PostEditor author={user} />
    )

    const titleLabel = getByLabelText(/title/i)
    fireEvent.change(titleLabel, { target: { value: post.title } })

    const contentLabel = getByLabelText(/content/i)
    fireEvent.change(contentLabel, { target: { value: post.content } })

    const tagsLabel = getByLabelText(/tags/i)
    fireEvent.change(tagsLabel, { target: { value: post.tags.join(', ') } })

    const submitButton = getByText(/save/i)

    fireEvent.click(submitButton)
    await wait(() => {
      expect(mockRedirect).toBeCalledTimes(1)
      expect(mockRedirect).toBeCalledWith({ to: '/' }, {})
    })
  })
})

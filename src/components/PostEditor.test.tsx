import React from 'react'
import {
  render as rtlRender,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react'
import { Redirect } from 'react-router'
import faker from 'faker'

import PostEditor from './PostEditor'
import { savePost } from '../api'

const mockRedirect = Redirect as jest.Mock<any>
const mockSavePost = savePost as jest.Mock<any>

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

function render() {
  const user = {
    id: faker.random.uuid()
  }
  const utils = rtlRender(<PostEditor author={user} />)

  const titleLabel = utils.getByLabelText(/title/i)
  const contentLabel = utils.getByLabelText(/content/i)
  const tagsLabel = utils.getByLabelText(/tags/i)
  const submitButton = utils.getByText(/save/i)

  return {
    ...utils,
    user,
    titleLabel,
    contentLabel,
    tagsLabel,
    submitButton
  }
}

describe('PostEditor', () => {
  test('renders a form with title, content, tags, and a submit button', () => {
    const { titleLabel, contentLabel, tagsLabel, submitButton } = render()

    expect(titleLabel).toBeInTheDocument()
    expect(contentLabel).toBeInTheDocument()
    expect(tagsLabel).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  test('the submit button is disabled when clicked', () => {
    const { submitButton } = render()
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
  })

  test('when submit call the api with the post', () => {
    const { titleLabel, contentLabel, tagsLabel, submitButton, user } = render()
    const post = getPost(user)

    fireEvent.change(titleLabel, { target: { value: post.title } })
    fireEvent.change(contentLabel, { target: { value: post.content } })
    fireEvent.change(tagsLabel, { target: { value: post.tags.join(', ') } })

    fireEvent.click(submitButton)
    expect(mockSavePost).toBeCalledTimes(1)
    expect(mockSavePost).toBeCalledWith(post)
  })

  test('after saving, redirects to home', async () => {
    const { titleLabel, contentLabel, tagsLabel, submitButton, user } = render()
    const post = getPost(user)

    fireEvent.change(titleLabel, { target: { value: post.title } })
    fireEvent.change(contentLabel, { target: { value: post.content } })
    fireEvent.change(tagsLabel, { target: { value: post.tags.join(', ') } })

    fireEvent.click(submitButton)
    await wait(() => {
      expect(mockRedirect).toBeCalledTimes(1)
      expect(mockRedirect).toBeCalledWith({ to: '/' }, {})
    })
  })

  test('when an error occur on saving, show a message', async () => {
    const {
      titleLabel,
      contentLabel,
      tagsLabel,
      submitButton,
      user,
      getByTestId
    } = render()
    const post = getPost(user)

    fireEvent.change(titleLabel, { target: { value: post.title } })
    fireEvent.change(contentLabel, { target: { value: post.content } })
    fireEvent.change(tagsLabel, { target: { value: post.tags.join(', ') } })

    mockSavePost.mockRejectedValueOnce({ data: { error: 'An error' } })
    fireEvent.click(submitButton)

    const postError = await waitForElement(() => getByTestId('post-error'))
    expect(postError).toBeInTheDocument()
    expect(submitButton).not.toBeDisabled()
  })
})

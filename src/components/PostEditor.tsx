import React from 'react'
import { Redirect } from 'react-router'

import { savePost } from '../api'

type Author = {
  id: string
}

interface PostEditorProps {
  author: Author
}

const PostEditor: React.FC<PostEditorProps> = ({ author }) => {
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [tags, setTags] = React.useState<string>('')
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [needRedirect, setNeedRedirect] = React.useState<boolean>(false)
  const [hasError, setHasError] = React.useState<boolean>(false)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setIsSaving(true)

    const post = {
      authorId: author.id,
      title,
      content,
      tags: tags.split(',').map(elem => elem.trim())
    }

    try {
      await savePost(post)
      setNeedRedirect(true)
    } catch {
      setHasError(true)
      setIsSaving(false)
    }
  }

  if (needRedirect) {
    return <Redirect to="/" />
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input
        type="text"
        id="title-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <label htmlFor="content-input">Content</label>
      <textarea
        id="content-input"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <label htmlFor="tags-input">Tags</label>
      <input
        type="text"
        id="tags-input"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />

      <button type="submit" disabled={isSaving}>
        Save
      </button>

      {hasError && (
        <p data-testid="post-error">
          There was an error when trying to save the post.
        </p>
      )}
    </form>
  )
}

export default PostEditor

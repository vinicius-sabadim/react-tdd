import React from 'react'

import { savePost } from '../api'

type Author = {
  id: string
}

interface PostEditorProps {
  author: Author
}

const PostEditor: React.FC<PostEditorProps> = ({ author }) => {
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [tags, setTags] = React.useState<string>('')

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setIsSaving(true)

    const post = {
      authorId: author.id,
      title,
      content,
      tags: tags.split(',').map(elem => elem.trim())
    }

    savePost(post)
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
    </form>
  )
}

export default PostEditor

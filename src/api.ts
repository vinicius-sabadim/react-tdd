type Post = {
  authorId: string
  title: string
  content: string
  tags: string[]
}

export const savePost = (post: Post) => {
  return new Promise(resolve => resolve())
}

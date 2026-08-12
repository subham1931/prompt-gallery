import Masonry from 'react-masonry-css'
import PromptCard from './PromptCard'

const breakpointCols = {
  default: 4,
  1280: 3,
  768: 2,
  767: 1,
}

export default function PromptMasonryGrid({ prompts, startIndex = 0 }) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {prompts.map((prompt, i) => (
        <PromptCard key={prompt.id} {...prompt} index={startIndex + i} />
      ))}
    </Masonry>
  )
}

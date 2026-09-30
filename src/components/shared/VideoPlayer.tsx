import React from 'react'

interface VideoPlayerProps {
  url?: string | null
  title?: string
  className?: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = 'Prewedding Video',
  className = '',
}) => {
  if (!url || url.trim() === '') {
    return null
  }

  // Parse YouTube or standard iframe embed
  const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(url)

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#E2D9CE] bg-black">
        {isDirectVideo ? (
          <video src={url} controls playsInline className="w-full h-full object-cover" />
        ) : (
          <iframe
            src={url}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </div>
  )
}

export default VideoPlayer

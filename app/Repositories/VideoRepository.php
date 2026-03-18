<?php

namespace App\Repositories;

use App\Models\Video;

class VideoRepository
{
    /**
     * Create a new video record.
     *
     * @param array $data
     * @return Video
     */
    public function create(array $data): Video
    {
        return Video::create($data);
    }

    /**
     * Delete a video record.
     *
     * @param Video $video
     * @return bool|null
     */
    public function delete(Video $video)
    {
        return $video->delete();
    }

    /**
     * Find a video by ID.
     *
     * @param int $id
     * @return Video
     */
    public function findOrFail(int $id): Video
    {
        return Video::findOrFail($id);
    }
}

package com.example.backend.service;

import com.example.backend.model.Media;
import com.example.backend.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    public Optional<Media> getMediaById(Long mediaId) {
        return mediaRepository.findById(mediaId);
    }

    public List<Media> getMediaByPostId(Long postId) {
        return mediaRepository.findByPostId(postId);
    }

    public void deleteMedia(Long mediaId) {
        mediaRepository.deleteById(mediaId);
    }

    public void createMedia(Media media) {
        mediaRepository.save(media);
    }

    public void updateMedia(Long mediaId, Media newMedia) {
        if (mediaRepository.existsById(mediaId)) {
            newMedia.setId(mediaId);
            mediaRepository.save(newMedia);
        }
    }

    public void deleteMediaByPostId(Long postId) {
        List<Media> mediaList = mediaRepository.findByPostId(postId);
        mediaRepository.deleteAll(mediaList);
    }

    public void deleteMediaByPostIdAndMediaId(Long postId, Long mediaId) {
        List<Media> mediaList = mediaRepository.findByPostId(postId);
        for (Media media : mediaList) {
            if (media.getId().equals(mediaId)) {
                mediaRepository.delete(media);
                break;
            }
        }
    }

    public void deleteAllMedia() {
        mediaRepository.deleteAll();
    }

    public void deleteMediaByPostIdAndMediaUrl(Long postId, String mediaUrl) {
        List<Media> mediaList = mediaRepository.findByPostId(postId);
        for (Media media : mediaList) {
            if (media.getMediaUrl().equals(mediaUrl)) {
                mediaRepository.delete(media);
            }
        }
    }
}

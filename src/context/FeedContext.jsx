import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import API from "../services/api";

const FeedContext = createContext();

const EMPTY_FEED_STATE = {
  posts: [],
  loading: false,
  error: null,
  hasFetched: false,
};

export const FeedProvider = ({ children }) => {
  const { user } = useAuth();
  const currentUserId = user?.id ?? null;
  const [feedByUser, setFeedByUser] = useState({});
  const requestsRef = useRef(new Map());
  const feedByUserRef = useRef(feedByUser);

  useEffect(() => {
    feedByUserRef.current = feedByUser;
  }, [feedByUser]);

  const setFeedState = useCallback((userId, updater) => {
    if (!userId) return;

    setFeedByUser((prev) => {
      const currentState = prev[userId] ?? EMPTY_FEED_STATE;
      const nextState =
        typeof updater === "function" ? updater(currentState) : updater;

      return {
        ...prev,
        [userId]: nextState,
      };
    });
  }, []);

  const fetchFeed = useCallback(async ({ force = false } = {}) => {
    if (!currentUserId) return [];

    const cachedState = feedByUserRef.current[currentUserId] ?? EMPTY_FEED_STATE;
    if (!force && cachedState.hasFetched) {
      return cachedState.posts;
    }

    const existingRequest = requestsRef.current.get(currentUserId);
    if (existingRequest) {
      return existingRequest;
    }

    setFeedState(currentUserId, (prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const request = API.get("/posts/feed")
      .then((res) => {
        const posts = res.data.posts ?? [];

        setFeedState(currentUserId, {
          posts,
          loading: false,
          error: null,
          hasFetched: true,
        });

        return posts;
      })
      .catch((error) => {
        setFeedState(currentUserId, (prev) => ({
          ...prev,
          loading: false,
          error,
          hasFetched: true,
        }));
        throw error;
      })
      .finally(() => {
        requestsRef.current.delete(currentUserId);
      });

    requestsRef.current.set(currentUserId, request);
    return request;
  }, [currentUserId, setFeedState]);

  const replaceFeedPosts = useCallback((updater) => {
    if (!currentUserId) return;

    setFeedState(currentUserId, (prev) => ({
      ...prev,
      posts: typeof updater === "function" ? updater(prev.posts) : updater,
      hasFetched: true,
      error: null,
    }));
  }, [currentUserId, setFeedState]);

  const prependFeedPost = useCallback((post) => {
    replaceFeedPosts((prev) => [post, ...prev]);
  }, [replaceFeedPosts]);

  const removeFeedPost = useCallback((postId) => {
    replaceFeedPosts((prev) => prev.filter((post) => post._id !== postId));
  }, [replaceFeedPosts]);

  const patchFeedPost = useCallback((postId, updater) => {
    replaceFeedPosts((prev) =>
      prev.map((post) => {
        if (post._id !== postId) return post;
        return typeof updater === "function" ? updater(post) : { ...post, ...updater };
      }),
    );
  }, [replaceFeedPosts]);

  const clearFeed = useCallback((userId = currentUserId) => {
    if (!userId) return;

    requestsRef.current.delete(userId);
    setFeedByUser((prev) => {
      if (!(userId in prev)) return prev;
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  }, [currentUserId]);

  const value = useMemo(() => {
    const currentFeed = currentUserId
      ? (feedByUser[currentUserId] ?? EMPTY_FEED_STATE)
      : EMPTY_FEED_STATE;

    return {
      feedPosts: currentFeed.posts,
      feedLoading: currentFeed.loading,
      feedError: currentFeed.error,
      hasFetchedFeed: currentFeed.hasFetched,
      fetchFeed,
      replaceFeedPosts,
      prependFeedPost,
      removeFeedPost,
      patchFeedPost,
      clearFeed,
    };
  }, [clearFeed, currentUserId, feedByUser, fetchFeed, patchFeedPost, prependFeedPost, removeFeedPost, replaceFeedPosts]);

  return (
    <FeedContext.Provider value={value}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);

  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }

  return context;
};

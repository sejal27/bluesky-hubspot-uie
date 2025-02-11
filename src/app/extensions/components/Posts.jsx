import React, { useState, useEffect } from "react";
import {
  Box,
  Link,
  Icon,
  Text,
  Flex,
  EmptyState,
  LoadingSpinner,
  Button,
  Panel,
  PanelBody,
  PanelSection,
  PanelFooter,
  Tile,
} from "@hubspot/ui-extensions";
import { BASE_URL } from "../constants";
import { hubspot } from "@hubspot/ui-extensions";

export const Posts = ({ handle }) => {
  console.log("handle in posts: ", handle);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    fetchPostsData();
  }, [handle]);

  const fetchPostsData = async (pageNum = 1) => {
    if (!handle) return;

    try {
      setLoading(true);
      let postsURL = `${BASE_URL}/posts?handle=${handle}&limit=${POSTS_PER_PAGE}&page=${pageNum}`;
      const postsResponse = await hubspot.fetch(postsURL, {
        timeout: 2000,
        method: "GET",
      });

      const responseText = await postsResponse.text();
      console.log(responseText);

      if (responseText) {
        const postsData = JSON.parse(responseText);
        // Sort posts by postedAt date in descending order (newest first)
        const sortedPosts = postsData.posts.sort((a, b) => {
          const dateA = new Date(a.postedAt.replace("Z", ""));
          const dateB = new Date(b.postedAt.replace("Z", ""));
          return dateB - dateA;
        });

        setPosts((prevPosts) =>
          pageNum === 1 ? sortedPosts : [...prevPosts, ...sortedPosts]
        );

        console.log("Updated Posts:", sortedPosts);
        console.log("Updated Number of posts:", sortedPosts.length);
      }
    } catch (err) {
      console.error("Error in fetchPostsData:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPostsData(nextPage);
  };

  return (
    <>
      <Panel width="md" id="bluesky-posts" title="Bluesky Posts">
        <PanelBody>
          <PanelSection>
            {loading && posts.length === 0 ? (
              <LoadingSpinner label="Loading posts..." />
            ) : posts.length > 0 ? (
              <Flex direction="column" gap="md">
                {posts.map((post, index) => (
                  <Tile key={post.uri} compact={true}>
                    <Flex direction="column" gap="sm">
                      <Text>{post.text}</Text>
                      <Flex justify="space-between" align="center">
                        <Flex gap="md" align="center">
                          <Text>♡ {post.likeCount}</Text>
                          <Text>
                            <Icon name="dataSync" size="sm" />{" "}
                            {post.repostCount}
                          </Text>
                          <Text>
                            <Icon name="comment" size="sm" />{" "}
                            {post.replyCount || 0}
                          </Text>
                        </Flex>
                        <Text color="gray" variant="microcopy">
                          {post.postedAt
                            ? new Date(
                                post.postedAt.replace("Z", "")
                              ).toLocaleDateString()
                            : "No date available"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Tile>
                ))}
                <Button variant="primary" onClick={loadMore} disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </Flex>
            ) : (
              <EmptyState
                title="No bluesky posts found for this user"
                flush={true}
                imageWidth={100}
                layout="vertical"
                reverseOrder={true}
              />
            )}
          </PanelSection>
        </PanelBody>
        <PanelFooter>
          <Link href={`https://bsky.app/profile/${handle}`} target="_blank">
            View full profile on Bluesky
          </Link>
        </PanelFooter>
      </Panel>
    </>
  );
};

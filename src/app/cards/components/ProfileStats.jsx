import React from "react";
import { Flex, Link, Text } from "@hubspot/ui-extensions";

export const ProfileStats = ({ profile }) => (
  <Flex gap="xs">
    <Link
      href={{
        url: `https://bsky.app/profile/${profile.handle}/followers`,
        external: false,
      }}
    >
      <Text variant="microcopy">
        <Text inline={true} format={{ fontWeight: "bold" }} variant="microcopy">
          {profile.followersCount.toLocaleString()}{" "}
        </Text>
        followers
      </Text>
    </Link>{" "}
    <Link
      href={{
        url: `https://bsky.app/profile/${profile.handle}/follows`,
        external: false,
      }}
    >
      <Text variant="microcopy">
        <Text inline={true} format={{ fontWeight: "bold" }} variant="microcopy">
          {profile.followsCount.toLocaleString()}{" "}
        </Text>
        following
      </Text>
    </Link>{" "}
    <Link
      href={{
        url: `https://bsky.app/profile/${profile.handle}`,
        external: false,
      }}
    >
      <Text variant="microcopy">
        <Text inline={true} format={{ fontWeight: "bold" }} variant="microcopy">
          {profile.postsCount.toLocaleString()}{" "}
        </Text>
        posts
      </Text>
    </Link>
  </Flex>
);

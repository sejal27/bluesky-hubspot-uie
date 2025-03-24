import React from "react";
import { Flex, Image, Text, Heading, Link } from "@hubspot/ui-extensions";

export const ProfileHeader = ({ profile }) => {
  return (
    <Flex direction="row" align="start" gap="sm" justify="start">
      <Image
        src={profile.avatar}
        alt={profile.displayName}
        width={64}
        height={64}
      />
      <Flex direction="column">
        <Link
          href={{
            url: `https://bsky.app/profile/${profile.handle}`,
            external: false,
          }}
        >
          <Heading>{profile.displayName}</Heading>
        </Link>
        <Text>@{profile.handle}</Text>
        <Text variant="microcopy">{profile.description}</Text>
      </Flex>
    </Flex>
  );
};

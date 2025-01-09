import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  EmptyState,
  LoadingSpinner,
  Button,
} from "@hubspot/ui-extensions";
import { CrmPropertyList } from "@hubspot/ui-extensions/crm";
import { hubspot } from "@hubspot/ui-extensions";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileStats } from "./components/ProfileStats";
import { BASE_URL } from "./constants";
import { Posts } from "./components/Posts";

hubspot.extend(({ actions }) => (
  <Extension
    fetchProperties={actions.fetchCrmObjectProperties}
    refreshObjectProperties={actions.refreshObjectProperties}
    onCrmPropertiesUpdate={actions.onCrmPropertiesUpdate}
  />
));

const Extension = ({
  fetchProperties,
  refreshObjectProperties,
  onCrmPropertiesUpdate,
}) => {
  const [blueskyHandle, setBlueskyHandle] = useState(null);
  const [isLoadingHandle, setIsLoadingHandle] = useState(true);

  useEffect(() => {
    // Initial fetch
    setIsLoadingHandle(true);
    fetchProperties(["bluesky_handle"]).then((properties) => {
      setBlueskyHandle(properties.bluesky_handle || null);
      setIsLoadingHandle(false);
    });

    // Listen for updates
    onCrmPropertiesUpdate(["bluesky_handle"], (properties, error) => {
      if (error) {
        console.error("Error updating properties:", error.message);
        return;
      }

      console.log("Property updated:", properties);
      setBlueskyHandle(properties.bluesky_handle || null);
      refreshObjectProperties();
    });
  }, [fetchProperties, onCrmPropertiesUpdate, refreshObjectProperties]);

  // const { profile, loading, refetch } = useBlueskyProfile(blueskyHandle);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlueskyData();
  }, [blueskyHandle]);

  const fetchBlueskyData = async () => {
    if (!blueskyHandle) return;

    try {
      setLoading(true);
      let profileURL = `${BASE_URL}/profile?handle=${blueskyHandle}`;
      const profileResponse = await hubspot.fetch(profileURL, {
        timeout: 2000,
        method: "GET",
      });

      const responseText = await profileResponse.text();
      console.log("response text", responseText);

      if (responseText) {
        const profileData = JSON.parse(responseText);
        if (profileData.error) {
          console.error("Error fetching Bluesky profile:", profileData.error);
          return;
        }
        // console.log("profile data", profileData);
        setProfile(profileData);
      }
    } catch (err) {
      console.error("Error in fetchBlueskyData:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingHandle) {
    return <LoadingSpinner label="Loading..." />;
  }

  if (!blueskyHandle) {
    return (
      <EmptyState
        layout="horizontal"
        title="No Bluesky handle found"
        imageWidth="100"
        reverseOrder={true}
      >
        <Text>
          Update the contact's Bluesky handle below to view their profile
          details
        </Text>
        <CrmPropertyList properties={["bluesky_handle"]} />
      </EmptyState>
    );
  }

  if (loading) {
    return <LoadingSpinner label="Loading Bluesky profile..." />;
  }

  if (!profile) {
    return (
      <EmptyState
        layout="vertical"
        title="No profile data"
        message="Could not load Bluesky profile information"
        action={{
          text: "Retry",
          onClick: fetchBlueskyData,
        }}
      />
    );
  }

  return (
    <>
      <Flex direction="row" gap="md" align="start">
        <Flex direction="column" gap="xs">
          <ProfileHeader profile={profile} />
          <ProfileStats profile={profile} />
        </Flex>
        <Box>
          <Button
            size="xs"
            variant="primary"
            overlay={<Posts handle={blueskyHandle} />}
          >
            Posts
          </Button>
        </Box>
      </Flex>
    </>
  );
};

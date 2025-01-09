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

  useEffect(() => {
    // Initial fetch
    fetchProperties(["bluesky_handle"]).then((properties) => {
      setBlueskyHandle(properties.bluesky_handle || null);
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

  return (
    <Box>
      <Text>Bluesky Handle: {blueskyHandle}</Text>
    </Box>
  );
};

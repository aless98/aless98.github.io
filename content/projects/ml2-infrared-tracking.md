---
title: "ML2InfraredTracking"
description: "An open-source Magic Leap 2 plugin that tracks surgical tools fitted with infrared retroreflective markers using the headset's raw depth sensor, estimating tool pose directly on the device."
category: "Surgical Navigation"
tags: ["Magic Leap 2", "Unity", "C#", "Infrared Tracking", "Pose Estimation"]
github: "https://github.com/aless98/ML2InfraredTracking"
image: "/projects/ml2-infrared-tracking-poster.webp"
video: "/projects/ml2-infrared-tracking.mp4"
---

Optical tool tracking is the backbone of surgical navigation, but it normally requires a dedicated external tracking camera. **ML2InfraredTracking** does it entirely on the headset: it ingests the Magic Leap 2 Depth **RAW** stream, detects infrared retroreflective markers, and estimates the pose of a user-defined tool from its marker constellation.

The plugin ships as a Unity sample with two example tool geometries (3D models plus marker coordinates), example materials, and a depth-frame visualisation path. You define your own tool by specifying its marker constellation in metres.

A key detail the project documents is **depth-pose synchronisation**: the sensor pose must be fetched for the exact depth frame being processed, otherwise the hologram visibly drifts. This requires a small change to the Magic Leap SDK, described in the repository.

**Status:** tracking is stable with five co-planar markers; a four-marker mode is under active development.

---
title: "Automatic Targeting for Deep Brain Stimulation"
description: "A deep-learning pipeline that localises the subthalamic nucleus on MRI and automatically plans a safe electrode trajectory for deep brain stimulation in Parkinson's disease."
category: "Medical Imaging"
tags: ["Deep Learning", "MRI", "Path Planning", "Neurosurgery", "Parkinson's Disease"]
github: ""
---

Deep brain stimulation for Parkinson's disease works only if the electrode lands inside the subthalamic nucleus — a structure a few millimetres across, with boundaries that are hard to see on MRI and are usually delineated by hand.

This project automates both halves of the problem: a deep-learning model localises the target, and an automatic planner then computes an electrode trajectory that reaches it while avoiding vessels and other critical structures along the way.

Published in *Brain and Spine*, 2025.

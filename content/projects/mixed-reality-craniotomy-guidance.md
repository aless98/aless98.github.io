---
title: "Mixed-Reality Craniotomy Guidance"
description: "An automatic, markerless mixed-reality system that projects a pre-operative craniotomy plan onto the patient's head through a head-mounted display, validated across multiple neurosurgical centres."
category: "Mixed Reality"
tags: ["Mixed Reality", "Neurosurgery", "Hologram Registration", "Clinical Validation"]
github: ""
image: "/projects/craniotomy-guidance.webp"
---

The core thread of my PhD. A surgeon plans a craniotomy on pre-operative CT/MRI, but transferring that plan to the patient in theatre traditionally relies on freehand estimation or bulky navigation hardware.

This system closes the gap with a head-mounted display. It automatically registers the virtual plan to the patient's head **without external fiducial markers**, so the surgeon sees the planned bone flap overlaid in situ on the real anatomy.

Development ran from an initial registration algorithm — evaluated in the *Preliminary Evaluation of a Hologram-to-Head Registration Algorithm* paper (XR Salento 2024) — through bench validation on purpose-built anatomical phantoms, to a **multicentric clinical study** covering several centres and operators, published in *Computer Methods and Programs in Biomedicine*.

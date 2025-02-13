import { Construction } from "../models/construction.model.js";
import { Diversion } from "../models/diversion.model.js";
import { Event } from "../models/event.model.js";
import { TrafficHotspot } from "../models/traffichotspot.model.js";

// Utility function to calculate distance between two points (Haversine formula)
const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth radius in meters
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const predictTraffic = async (req, res) => {
  const { path, date, timeSlot, routePoints } = req.body;

  const pointBatchSize = 7;
  let score = 0;
  let constructionCount = 0;
  let diversionCount = 0;
  let eventCount = 0;
  let hotspotCount = 0;

  try {
    // Filter every 7th entry from routePoints
    const filteredPoints = routePoints.filter((_, index) => index % pointBatchSize === 0);

    const constructions = await Construction.find({});
    const diversions = await Diversion.find({});
    const events = await Event.find({});
    const hotspots = await TrafficHotspot.find({});

    for (let point of filteredPoints) {
      // Check constructions
      for (let construction of constructions) {
        const isDateInRange =
          new Date(date) >= new Date(construction.startDate) &&
          new Date(date) <= new Date(construction.expectedEndDate);
        if (isDateInRange) {
          for (let cPoint of construction.constructionPoints) {
            if (calculateDistance(point, cPoint) <= 200) {
              constructionCount++;
              score += 10 * constructionCount;
              break;
            }
          }
        }
      }

      // Check diversions
      for (let diversion of diversions) {
        const isDateInRange =
          new Date(date) >= new Date(diversion.startDate) &&
          new Date(date) <= new Date(diversion.endDate);
        if (isDateInRange) {
          for (let dPoint of diversion.diversionPoints) {
            if (calculateDistance(point, dPoint) <= 200) {
              diversionCount++;
              score += 10 * diversionCount;
              break;
            }
          }
        }
      }

      // Check events
      for (let event of events) {
        const isDateInRange =
          new Date(date) >= new Date(event.startTime) &&
          new Date(date) <= new Date(event.endTime);
        if (isDateInRange) {
          for (let ePoint of event.eventPoints) {
            if (calculateDistance(point, ePoint) <= 200) {
              eventCount++;
              score += 10 * eventCount;
              break;
            }
          }
        }
      }

      // Check traffic hotspots
      for (let hotspot of hotspots) {
        const hotspotPoint = {
          lat: parseFloat(hotspot.latitude),
          lng: parseFloat(hotspot.longitude),
        };
        if (calculateDistance(point, hotspotPoint) <= 200) {
          hotspotCount++;
          score += 10 * hotspotCount;
          break;
        }
      }
    }

    res.json({
      score,
      constructionCount,
      diversionCount,
      eventCount,
      hotspotCount,
    });
  } catch (error) {
    console.error("Error predicting traffic:", error);
    res.status(500).json({ error: "Error predicting traffic" });
  }
};

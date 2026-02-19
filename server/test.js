console.log("Test script running...");
try {
    const express = require('express');
    console.log("Express loaded successfully");
} catch (e) {
    console.error("Failed to load express:", e.message);
}
console.log("Test script finished");

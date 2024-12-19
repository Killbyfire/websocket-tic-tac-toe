const joinRoomButton = document.getElementById("joinRoom");
const generateRoomButton = document.getElementById("generateRoom");

const roomInput = document.getElementById("roomID");
const minimumInput = 5;

joinRoomButton.addEventListener("click", () => {
  if (roomInput.value && roomInput.value.length >= minimumInput) {
    location.href = "/room/" + roomInput.value;
  }

});

generateRoomButton.addEventListener("click", () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let generatedHash = "";
  for (let i = 0; i < 5; i++) {
    generatedHash += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  location.href = "/room/" + generatedHash;
});

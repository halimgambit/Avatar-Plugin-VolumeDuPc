exports.action = function(data, callback) {
    let client = setClient(data);
    info("soundDuPc:", data.client, "To:", client);
    handleSoundCommand(data, client);
    callback();
}

function handleSoundCommand(data, client) {

    const sound = data.action.rawSentence.replace(/mets|volume|son|le|à|%|pour cent/gi, "").trim().toLowerCase();
    const command = "%CD%/lib/nircmd/nircmdc64.exe";
    const volumeLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    if (volumeLevels.includes(parseInt(sound))) {
      const volume = parseInt(sound);
      Avatar.speak(`Le volume est maintenant à ${volume} %|Le son est maintenant à ${volume} %`, data.client, () => {
        Avatar.Speech.end(data.client, true, () => {
          Avatar.runApp(`${command} setsysvolume ${volume * 655}`, null, data.client);
        });
      });
      return;
    }
    
    switch (sound) {
        case "monte":
        case "baisse":
        case "coupe":
        case "remets":
        case "remis":
        const message = `Je ${sound} le volume|Je ${sound} le son`;
        Avatar.speak(message, data.client, () => {
        Avatar.Speech.end(data.client, true, () => {
        switch (sound) {
        case "monte":
        case "baisse":
        const volumeChange = (sound === "monte") ? 5000 : -5000
        Avatar.runApp(`${command} changesysvolume ${volumeChange}`, null, data.client);
        break;
        case "coupe":
        case "remets":
        case "remis":
        const volumeArgument = (sound === "coupe") ? 1 : 0;
        Avatar.runApp(`${command} mutesysvolume ${volumeArgument}`, null, data.client);
        break;
    }
    });
    });
       break;
       default:
       Avatar.speak("Je ne comprends pas cette commande de son", data.client);
      }     
          
      }
      

function setClient(data) {
    let client = data.client;
    if (data.action.room) {
        client = (data.action.room !== 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
    }
    if (data.action.setRoom) {
        client = data.action.setRoom;
    }
    return client;
}

const router = require("express").Router();
const KautianVocab = require("../models").kautianVocab;
const KautianSemantics = require("../models").kautianSemantics;
const KautianSentence = require("../models").kautianSentence;

router.use((req, res, next) => {
  console.log("Kautian route received a request...");
  next();
});

// display all courses
router.get("/", async (req, res) => {
  try {
    res.send("Under construction ...");
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/:hanji", async (req, res) => {
  try {
    let { hanji } = req.params;

    // Find vocab data by hanji
    let vocabDataArray = await KautianVocab.find({ hanji: hanji });

    // Initialize an array to store vocab with semantics
    let vocabWithSemanticsArray = [];

    // Iterate over each document in vocabDataArray
    for (let vocabData of vocabDataArray) {
      let vocab_id = vocabData.vocab_id;

      // Find semantics data by vocab_id
      let semanticsDataArray = [];
      let semanticsData = await KautianSemantics.find({ vocab_id: vocab_id });

      // Iterate over each semantics
      for (let { semantics_id, pos, explanation } of semanticsData) {
        // Find sentences data by semantics_id
        let sentencesDataArray = [];
        let sentencesData = await KautianSentence.find({
          semantics_id: semantics_id,
        });

        // Push sentences data to sentencesDataArray
        for (let sentenceData of sentencesData) {
          sentencesDataArray.push({
            hanji: sentenceData.hanji,
            lomaji: sentenceData.lomaji,
            mandarin: sentenceData.mandarin,
          });
        }

        // Push semantics data to semanticsDataArray
        semanticsDataArray.push({
          pos,
          explanation,
          sentences: sentencesDataArray,
        });
      }

      // Push vocab with semantics to vocabWithSemanticsArray
      vocabWithSemanticsArray.push({
        vocab: vocabData,
        semantics: semanticsDataArray,
      });
    }

    // Send response
    res.json(vocabWithSemanticsArray);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

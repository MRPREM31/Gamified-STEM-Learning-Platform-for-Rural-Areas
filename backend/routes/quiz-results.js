// Save quiz results
app.post('/api/quiz-results', async (req, res) => {
  try {
    const { studentId, quizId, score, badge, completedAt } = req.body;
    
    // Calculate coins based on score percentage (max 100 coins)
    const quiz = await db.get('SELECT COUNT(*) as totalQuestions FROM questions WHERE quiz_id = ?', [quizId]);
    const totalPoints = quiz.totalQuestions * 10; // Each question is worth 10 points
    const percentage = (score / totalPoints) * 100;
    const coinsEarned = Math.floor(percentage); // One coin per percentage point, max 100

    // Insert the result
    await db.run(`
      INSERT INTO quiz_results 
      (student_id, quiz_id, score, coins_earned, badge, completed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [studentId, quizId, score, coinsEarned, badge, completedAt]);

    // Update student's total coins
    await db.run(`
      UPDATE students 
      SET total_coins = total_coins + ?,
          quizzes_completed = quizzes_completed + 1
      WHERE id = ?
    `, [coinsEarned, studentId]);

    res.json({ 
      success: true, 
      message: 'Quiz results saved successfully',
      coinsEarned,
      totalScore: score,
      badge
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    res.status(500).json({ error: 'Failed to save quiz results' });
  }
});
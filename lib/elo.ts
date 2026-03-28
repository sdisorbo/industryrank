const K = 32

export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

export function newRatings(
  winnerElo: number,
  loserElo: number
): { winner: number; loser: number } {
  const expectedWin = expectedScore(winnerElo, loserElo)
  const expectedLoss = expectedScore(loserElo, winnerElo)
  return {
    winner: winnerElo + K * (1 - expectedWin),
    loser: loserElo + K * (0 - expectedLoss),
  }
}

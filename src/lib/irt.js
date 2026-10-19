const PRIOR_VARIANCE = 4;
const MAX_NEWTON_STEP = 0.75;
const THETA_MIN = -4;
const THETA_MAX = 4;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(value) {
  if (value >= 0) {
    const exponential = Math.exp(-value);
    return 1 / (1 + exponential);
  }

  const exponential = Math.exp(value);
  return exponential / (1 + exponential);
}

export function probabilityCorrect(theta, item) {
  const logistic = sigmoid(item.a * (theta - item.b));
  return item.c + (1 - item.c) * logistic;
}

export function itemInformation(theta, item) {
  const probability = probabilityCorrect(theta, item);
  if (probability <= 1e-9 || probability >= 1 - 1e-9) return 0;

  const numerator =
    item.a * item.a * (1 - probability) * Math.pow(probability - item.c, 2);
  const denominator = Math.pow(1 - item.c, 2) * probability;
  return denominator <= 1e-12 ? 0 : numerator / denominator;
}

function scoreFunction(theta, items, responses) {
  const likelihoodScore = items.reduce((score, item, index) => {
    const probability = probabilityCorrect(theta, item);
    if (probability <= 1e-9 || probability >= 1 - 1e-9) return score;

    return (
      score +
      (item.a * (responses[index] - probability) * (probability - item.c)) /
        (probability * (1 - item.c))
    );
  }, 0);

  return likelihoodScore - theta / PRIOR_VARIANCE;
}

function totalInformation(theta, items) {
  return (
    1 / PRIOR_VARIANCE +
    items.reduce((total, item) => total + itemInformation(theta, item), 0)
  );
}

export function estimateTheta(items, responses, options = {}) {
  if (items.length !== responses.length) {
    throw new Error('items and responses must have the same length');
  }

  if (items.length === 0) {
    return { theta: 0, standardError: Math.sqrt(PRIOR_VARIANCE) };
  }

  let theta = Number.isFinite(options.startingTheta) ? options.startingTheta : 0;
  const maxIterations = options.maxIterations || 30;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const information = totalInformation(theta, items);
    const rawStep = scoreFunction(theta, items, responses) / information;
    const step = clamp(rawStep, -MAX_NEWTON_STEP, MAX_NEWTON_STEP);
    theta = clamp(theta + step, THETA_MIN, THETA_MAX);

    if (Math.abs(step) < 1e-4) break;
  }

  return {
    theta,
    standardError: 1 / Math.sqrt(totalInformation(theta, items))
  };
}

export function itemParametersForQuestion(question) {
  if (question.irt) return question.irt;

  const difficultyByLevel = {
    'Nhận biết': -1.5,
    'Thông hiểu': -0.5,
    'Vận dụng': 0.5,
    'Vận dụng cao': 1.5
  };

  return {
    a: 1.2,
    b: difficultyByLevel[question.level] ?? 0,
    c: 0.25
  };
}


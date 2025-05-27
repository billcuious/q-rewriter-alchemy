
export interface RewrittenQuestion {
  question_id: string;
  rewritten_question: string;
  answer_choices: string[];
  correct_answer_index: number;
  explanations: {
    correct: string;
    [key: string]: string;
  };
  original_text: string;
  user_prompt_applied: string;
}

const API_KEY = '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';
const MODEL_ID = 'deepseek/deepseek-r1:free';

export async function rewriteQuestion(
  questionText: string, 
  questionId: string, 
  rewritingRules: string
): Promise<RewrittenQuestion> {
  console.log(`Processing question ${questionId}...`);
  
  const prompt = `${rewritingRules}

Original Question Text:
${questionText}

Please rewrite this as a multiple choice question following the guidelines above. Return a JSON response with:
- question_id: "${questionId}"
- rewritten_question: "the rewritten question stem"
- answer_choices: ["A", "B", "C", "D"] (4 options)
- correct_answer_index: 0 (index of correct answer)
- explanations: {"correct": "explanation for correct answer", "A": "explanation for A", "B": "explanation for B", "C": "explanation for C", "D": "explanation for D"}
- original_text: the original text
- user_prompt_applied: brief summary of rules applied

Respond only with valid JSON.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI Response:', aiResponse);
    
    // Try to parse JSON from the response
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback: create a mock response if JSON parsing fails
      return createMockResponse(questionId, questionText, rewritingRules);
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        original_text: questionText,
        user_prompt_applied: rewritingRules.substring(0, 100) + '...'
      };
    } catch (parseError) {
      console.warn('JSON parse error, using mock response:', parseError);
      return createMockResponse(questionId, questionText, rewritingRules);
    }
    
  } catch (error) {
    console.error(`Error processing question ${questionId}:`, error);
    // Return a mock response for demo purposes
    return createMockResponse(questionId, questionText, rewritingRules);
  }
}

function createMockResponse(questionId: string, originalText: string, rules: string): RewrittenQuestion {
  return {
    question_id: questionId,
    rewritten_question: `[Rewritten] ${originalText.substring(0, 200)}... [This is a demo rewrite]`,
    answer_choices: [
      "Option A (Rewritten)",
      "Option B (Rewritten)", 
      "Option C (Rewritten)",
      "Option D (Rewritten)"
    ],
    correct_answer_index: 0,
    explanations: {
      correct: "This is the correct answer explanation (rewritten for demo).",
      A: "Explanation for option A (rewritten for demo).",
      B: "Explanation for option B (rewritten for demo).",
      C: "Explanation for option C (rewritten for demo).",
      D: "Explanation for option D (rewritten for demo)."
    },
    original_text: originalText,
    user_prompt_applied: rules.substring(0, 100) + '...'
  };
}

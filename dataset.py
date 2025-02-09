faq_dataset = {
    "What is the school vision?": "The leading University in human resource development, knowledge and technology generation and environmental stewardship.",
    "What is the tuition fee?": "The University of Rizal System (URS) is a state university in the Philippines, established to provide quality education to the public without imposing tuition fees. It aims to promote academic excellence, research, and community development, serving as a center for higher education in the region.",
    "How can I apply for admission?": "You can apply for admission by filling out our online application form on the school's website or by visiting the admissions office.",
    "What extracurricular activities are offered?": "Our school offers a variety of extracurricular activities, including sports, music, drama, debate, and community service projects.",
    "What is the school schedule like?": "The school operates from Monday to Friday, with classes starting at 8 AM and ending at 3 PM. We also have a lunch break from 12 PM to 1 PM.",
    "How do I contact the school administration?": "You can contact the URS administration through the following channels: Email: admin@urs.edu.ph or Phone: (02) 8-651-0000",
    "What is the school uniform policy?": "Students are required to wear the official URS uniform during school hours. The uniform typically includes a white shirt, blue trousers or skirt, and black shoes. Specific details may vary by campus and program.",
    "Is there a school bus service?": "Yes, we offer a school bus service that covers several routes around the city. You can register your child for the bus service at the beginning of each semester.",
    "Does the school provide lunch?": "Yes, the school provides a canteen with a variety of lunch options. Students can also bring their own packed lunch.",
    "Are there any scholarships available?": "Yes, we offer a limited number of scholarships based on academic performance and financial need. For more details, please visit the scholarship section on our website.",
    "What is the school's policy on bullying?": "URS has a strict anti-bullying policy. All incidents of bullying are taken seriously and thoroughly investigated.",
    "What are the graduation requirements?": "Students must complete all required courses, pass final exams, and participate in community service activities to graduate.",
    "Are parents allowed to attend school events?": "Yes, parents are encouraged to attend various events such as parent-teacher conferences, sports days, and annual celebrations.",
    "How can I access the student's grades?": "Grades can be accessed through the URS Student Access Module by logging in with your parent account credentials.",
    "What is the school's policy on mobile phones?": "Students can bring mobile phones to school but must keep them turned off during class hours. Phones can be used during breaks and lunch periods.",
    "How do I register for a parent-teacher conference?": "Parent-teacher conferences are scheduled twice a year. You can register online through the URS portal or contact the administration for assistance.",
    "Who are the members of the Board of Regents at URS?": "The Board of Regents includes: HON. LILIAN A. DE LAS LLAGAS, Chairperson of the Commission on Higher Education; HON. NANCY TALAVERA-PASCUAL, President of URS; and other members such as HON. EMMANUEL JOEL J. VILLANUEVA, HON. MARK O. GO, among others.",
    "Who are the presidents of URS?": "The university has had several presidents: Dr. Olivia F. De Leon (First President), who served following the enactment of Republic Act 9157 in 2001, and Dr. Nancy T. Pascual (Third President), appointed in 2020.",
    "What is the role of campus leadership at URS?": "Campus leadership includes directors or deans who are responsible for overseeing academic and administrative functions at each URS campus, such as Dr. Digna C. Ramos (2007-2009) and Engr. Armando D. Vale (2012-2013) at the Antipolo Campus."
}

def get_faq_response(user_input):
    """Fetches the FAQ response based on the user's input."""
    for question, response in faq_dataset.items():
        if question.lower() in user_input.lower():
            return response
    return None 

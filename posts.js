function getNextPost(percent, university, element) {
    let female_percentage = percent.toString();
    if (university.value === 'none') {
        element.innerHTML = `${female_percentage}`;
        return;
    }
    let university_name = university.options[university.selectedIndex].text;
    const posts = {
        under30: [
            `Whoa, 🚨 only ${female_percentage}% of STEM students at ${university_name} are women?! 
            Looks like this place could use a serious girl-power upgrade. 🌟 
            Time to smash some stereotypes and make your mark. 💪 #WomenInSTEM #BreakTheBias`,
            `Looks like ${university_name} hasn’t heard of girl power yet 
            – only ${female_percentage}% women in STEM? 😱 Time for you to roll in, 
            take charge, and turn this stat around. 💪👩‍🔬 #SheCanSTEM #ScienceSquad`,
            `Yikes! Only ${female_percentage}% of STEM students at ${university_name} are women?! 
            Looks like they’re overdue for a revolution. 🧠✨ Bring your brilliance and let’s 
            tip those scales! ⚖️ #GirlsInSTEM #TimeForChange`
        ],
        under40: [
            `Hey, with ${female_percentage}% women in STEM at ${university_name}, 
            the scales are still tipping the other way. 👩‍🔬✨ But guess what? 
            You’ve got the smarts and the drive to change the game. 🎯 
            Let's do this, one equation at a time. ⚡ #STEMQueens #LeadTheWay`,
            `Um, ${female_percentage}% women in STEM at ${university_name}? 🤔 
            This is your chance to make waves 🌊 and show them what women in science are made of. 🔥 
            You’ve got this! #STEMSuperstar #GirlsLead`,
            `Okay, we see you, ${university_name}! 👀 ${female_percentage}% of women in STEM is decent, 
            but we’re aiming for 100% confidence for every girl in science. 🚀 
            Go ahead and take your spot at the table – the lab’s waiting for YOU. 💡 
            #GirlsInSTEM #ScienceSquad`
        ],
        above40: [
            `Ladies, we’re not quite there yet – only ${female_percentage}% women in STEM at 
            ${university_name}. But that’s all the more reason to bring your magic and make some history. 
            ✨👑 #STEMGirlsUnite #YouCanDoIt`,
            `We’re close, but not close enough. 👀 With ${female_percentage}% women in STEM, 
            ${university_name} is ready for some serious girl power. Bring your A-game and show them 
            how it’s done! 💻🔬💥 #STEMShine #GirlsInScience`,
            `You see this, right? ${female_percentage}% women in STEM at ${university_name} – 
            pretty good, but not there yet. The world needs your voice, your ideas, and your genius. 🌟 
            Go claim your spot! #GirlsWhoCode #STEMspiration`
        ]
    }
    if (percent < 30) {  
        element.innerHTML = posts.under30[Math.floor(Math.random() * posts.under30.length)];
    }
    else if (percent > 40) {
        element.innerHTML = posts.above40[Math.floor(Math.random() * posts.above40.length)];
    }
    else {
        element.innerHTML = posts.under40[Math.floor(Math.random() * posts.under40.length)];
    }
}


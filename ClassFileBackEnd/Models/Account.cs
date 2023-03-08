﻿using System;
using System.Collections.Generic;

namespace ClassFileBackEnd.Models;

public partial class Account
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? Fullname { get; set; }

    public string? AccountType { get; set; }

    public string? ImageAvatar { get; set; }

    public virtual ICollection<Class> ClassesNavigation { get; } = new List<Class>();

    public virtual ICollection<Post> Posts { get; } = new List<Post>();

    public virtual ICollection<Class> Classes { get; } = new List<Class>();
}

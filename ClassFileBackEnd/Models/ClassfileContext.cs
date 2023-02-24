﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ClassFileBackEnd.Models;

public partial class ClassfileContext : DbContext
{
    public ClassfileContext()
    {
    }

    public ClassfileContext(DbContextOptions<ClassfileContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Class> Classes { get; set; }

    public virtual DbSet<File> Files { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server=(local); database=classfile; uid=sa; pwd=sa; TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("account");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AccountType)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("account_type");
            entity.Property(e => e.Fullname)
                .HasMaxLength(200)
                .HasColumnName("fullname");
            entity.Property(e => e.Password)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.ToTable("class");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ClassName)
                .HasMaxLength(50)
                .HasColumnName("class_name");
            entity.Property(e => e.TeacherAccountId).HasColumnName("teacher_account_id");

            entity.HasMany(d => d.StudentAccounts).WithMany(p => p.Classes)
                .UsingEntity<Dictionary<string, object>>(
                    "StudentClass",
                    r => r.HasOne<Account>().WithMany()
                        .HasForeignKey("StudentAccountId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_student_class_account"),
                    l => l.HasOne<Class>().WithMany()
                        .HasForeignKey("ClassId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_student_class_class"),
                    j =>
                    {
                        j.HasKey("ClassId", "StudentAccountId");
                        j.ToTable("student_class");
                        j.IndexerProperty<int>("ClassId").HasColumnName("class_id");
                        j.IndexerProperty<int>("StudentAccountId").HasColumnName("student_account_id");
                    });
        });

        modelBuilder.Entity<File>(entity =>
        {
            entity.ToTable("file");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FileName)
                .HasMaxLength(100)
                .IsFixedLength()
                .HasColumnName("file_name");
            entity.Property(e => e.FileType)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasColumnName("file_type");
            entity.Property(e => e.PostId).HasColumnName("post_id");

            entity.HasOne(d => d.Post).WithMany(p => p.Files)
                .HasForeignKey(d => d.PostId)
                .HasConstraintName("FK_file_post");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.ToTable("post");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ClassId).HasColumnName("class_id");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("date_created");
            entity.Property(e => e.PostedAccountId).HasColumnName("posted_account_id");
            entity.Property(e => e.Title)
                .HasMaxLength(500)
                .HasColumnName("title");

            entity.HasOne(d => d.Class).WithMany(p => p.Posts)
                .HasForeignKey(d => d.ClassId)
                .HasConstraintName("FK_post_class");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}